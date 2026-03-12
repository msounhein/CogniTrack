'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, FileText, Folder as FolderIcon, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { useRouter } from 'next/navigation';

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
  onRefresh?: () => void;
}

export default function TreeItem({ item, type, level = 0, onRefresh }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleFolder = () => {
    if (type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete this ${type}?`);
    if (!confirmDelete) return;

    try {
      const endpoint = type === 'folder' ? `/api/folders/${item.id}` : `/api/documents/${item.id}`;
      // Note: For document delete we need a dedicated API or handle it in the existing route
      // For now I'll implement folder delete. Document delete needs /api/documents/[id] DELETE
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (response.ok) {
        onRefresh?.();
        if (type === 'document') router.push('/');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const paddingLeft = level * 12 + 12;

  const content = (
    <div 
      className={cn(
        "flex items-center gap-2 py-1.5 px-2 hover:bg-accent rounded-md cursor-pointer transition-colors group",
        type === 'folder' ? "font-medium text-foreground/90" : "text-muted-foreground hover:text-foreground"
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={toggleFolder}
    >
      <div className="w-4 h-4 flex items-center justify-center shrink-0">
        {type === 'folder' && (
          isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
        )}
        {type === 'document' && <FileText className="w-3.5 h-3.5" />}
      </div>
      {type === 'folder' && <FolderIcon className="w-3.5 h-3.5 text-primary fill-primary/10 shrink-0" />}
      <span className="text-[13px] truncate leading-none">
        {type === 'folder' ? (item as Folder).name : (item as Document).title || 'Untitled Note'}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col">
      <ContextMenu>
        <ContextMenuTrigger>
          {type === 'document' ? (
            <Link href={`/notes/${item.id}`} className="block">
              {content}
            </Link>
          ) : (
            content
          )}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem className="gap-2">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Rename</span>
          </ContextMenuItem>
          <ContextMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={handleDelete}>
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      
      {isOpen && type === 'folder' && (
        <div className="flex flex-col mt-1">
          {(item as Folder).subfolders?.map((sub) => (
            <TreeItem key={sub.id} item={sub} type="folder" level={level + 1} onRefresh={onRefresh} />
          ))}
          {(item as Folder).documents.map((doc) => (
            <TreeItem key={doc.id} item={doc} type="document" level={level + 1} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </div>
  );
}
