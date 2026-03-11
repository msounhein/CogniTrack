'use client';

import { useState, useEffect } from 'react';
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

export default function FileTree() {
  const [data, setData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTree() {
      try {
        const response = await fetch('/api/tree');
        if (response.ok) {
          const result = await response.json();
          // Build hierarchy
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
    }

    fetchTree();
  }, []);

  // Simple recursive tree builder
  function buildTree(flatFolders: Folder[]): Folder[] {
    const folderMap = new Map<string, Folder>();
    const roots: Folder[] = [];

    // Initialize map
    flatFolders.forEach((f) => {
      folderMap.set(f.id, { ...f, subfolders: [] });
    });

    // Nest folders
    flatFolders.forEach((f) => {
      const folder = folderMap.get(f.id)!;
      if (f.parentId) {
        const parent = folderMap.get(f.parentId);
        if (parent) {
          parent.subfolders = parent.subfolders || [];
          parent.subfolders.push(folder);
        } else {
          // If parent not in map (shouldn't happen), consider it a root
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
      {data?.folders.map((folder) => (
        <TreeItem key={folder.id} item={folder} type="folder" />
      ))}
      {data?.rootDocuments.map((doc) => (
        <TreeItem key={doc.id} item={doc} type="document" />
      ))}
      {!data?.folders.length && !data?.rootDocuments.length && (
        <div className="text-xs text-muted-foreground italic px-4 py-2">
          No files or folders found.
        </div>
      )}
    </div>
  );
}
