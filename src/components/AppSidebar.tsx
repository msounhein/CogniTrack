'use client';

import { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { LayoutDashboard, Search, FolderPlus, FilePlus } from 'lucide-react';
import Link from 'next/link';
import FileTree from './FileTree';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleCreateNote = async (folderId?: string) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note', folderId }),
      });
      if (response.ok) {
        const note = await response.json();
        setRefreshKey(k => k + 1);
        router.push(`/notes/${note.id}`);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleCreateFolder = async (parentId?: string) => {
    const name = prompt('Folder name:');
    if (!name) return;

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId }),
      });
      if (response.ok) {
        setRefreshKey(k => k + 1);
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2 mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">C</span>
            </div>
            <span className="font-bold text-lg">CogniTrack</span>
          </Link>
        </div>
        
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..." 
            className="pl-8 h-9 bg-accent/50 border-none focus-visible:ring-1" 
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/tasks" />} tooltip="Dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Task Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between pr-4">
            <SidebarGroupLabel>Files & Folders</SidebarGroupLabel>
            <div className="flex gap-1">
              <button 
                onClick={() => handleCreateFolder()}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                title="New Folder"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleCreateNote()}
                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                title="New Note"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <SidebarGroupContent>
            <FileTree searchQuery={searchQuery} key={refreshKey} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
