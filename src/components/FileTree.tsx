'use client';

import { useState, useEffect, useMemo } from 'react';
import TreeItem from './TreeItem';
import { Loader2 } from 'lucide-react';

interface Document {
  id: string;
  title: string;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  documents: Document[];
  subfolders?: Folder[];
}

interface TreeData {
  folders: Folder[];
  rootDocuments: Document[];
}

interface FileTreeProps {
  searchQuery?: string;
}

export default function FileTree({ searchQuery = '' }: FileTreeProps) {
  const [data, setData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTree = async () => {
    try {
      const response = await fetch('/api/tree');
      if (response.ok) {
        const result = await response.json();
        const builtFolders = buildTree(result.folders);
        setData({
          folders: builtFolders,
          rootDocuments: result.rootDocuments,
        });
      }
    } catch (error) {
      console.error('Failed to fetch tree:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  // Recursive search filter
  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();

    const filterFolder = (folder: Folder): Folder | null => {
      const filteredSubfolders = folder.subfolders
        ?.map(filterFolder)
        .filter((f): f is Folder => f !== null) || [];
      
      const filteredDocs = folder.documents.filter((doc) => 
        doc.title.toLowerCase().includes(query)
      );

      if (
        folder.name.toLowerCase().includes(query) || 
        filteredSubfolders.length > 0 || 
        filteredDocs.length > 0
      ) {
        return {
          ...folder,
          subfolders: filteredSubfolders,
          documents: filteredDocs
        };
      }
      return null;
    };

    const filteredFolders = data.folders
      .map(filterFolder)
      .filter((f): f is Folder => f !== null);

    const filteredRootDocs = data.rootDocuments.filter((doc) => 
      doc.title.toLowerCase().includes(query)
    );

    return {
      folders: filteredFolders,
      rootDocuments: filteredRootDocs
    };
  }, [data, searchQuery]);

  function buildTree(flatFolders: Folder[]): Folder[] {
    const folderMap = new Map<string, Folder>();
    const roots: Folder[] = [];

    flatFolders.forEach((f) => {
      folderMap.set(f.id, { ...f, subfolders: [] });
    });

    flatFolders.forEach((f) => {
      const folder = folderMap.get(f.id)!;
      if (f.parentId) {
        const parent = folderMap.get(f.parentId);
        if (parent) {
          parent.subfolders = parent.subfolders || [];
          parent.subfolders.push(folder);
        } else {
          roots.push(folder);
        }
      } else {
        roots.push(folder);
      }
    });

    return roots;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto px-2">
      {filteredData?.folders.map((folder) => (
        <TreeItem key={folder.id} item={folder} type="folder" onRefresh={handleRefresh} />
      ))}
      {filteredData?.rootDocuments.map((doc) => (
        <TreeItem key={doc.id} item={doc} type="document" onRefresh={handleRefresh} />
      ))}
      {!filteredData?.folders.length && !filteredData?.rootDocuments.length && (
        <div className="text-xs text-muted-foreground italic px-4 py-2">
          {searchQuery ? 'No results found.' : 'No files or folders found.'}
        </div>
      )}
    </div>
  );
}
