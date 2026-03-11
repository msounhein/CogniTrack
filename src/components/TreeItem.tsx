'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, FileText, Folder as FolderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

interface TreeItemProps {
  item: Folder | Document;
  type: 'folder' | 'document';
  level?: number;
}

export default function TreeItem({ item, type, level = 0 }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    if (type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const paddingLeft = level * 12 + 12;

  if (type === 'document') {
    const doc = item as Document;
    return (
      <Link href={`/notes/${doc.id}`} className="block">
        <div 
          className="flex items-center gap-2 py-1 px-3 hover:bg-accent rounded-md cursor-pointer transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm truncate">{doc.title || 'Untitled Note'}</span>
        </div>
      </Link>
    );
  }

  const folder = item as Folder;
  return (
    <div className="flex flex-col">
      <div 
        className="flex items-center gap-2 py-1 px-3 hover:bg-accent rounded-md cursor-pointer transition-colors group"
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={toggleFolder}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </div>
        <FolderIcon className="w-4 h-4 text-primary fill-primary/10" />
        <span className="text-sm font-medium truncate">{folder.name}</span>
      </div>
      
      {isOpen && (
        <div className="flex flex-col mt-1">
          {folder.subfolders?.map((sub) => (
            <TreeItem key={sub.id} item={sub} type="folder" level={level + 1} />
          ))}
          {folder.documents.map((doc) => (
            <TreeItem key={doc.id} item={doc} type="document" level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
