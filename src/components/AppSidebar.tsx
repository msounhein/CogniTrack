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
import { LayoutDashboard, Search, FolderPlus, FilePlus, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import FileTree from './FileTree';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useEffect } from 'react';

export default function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(k => k + 1);
    window.addEventListener('note-saved', handleRefresh);
    return () => window.removeEventListener('note-saved', handleRefresh);
  }, []);

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
        <div className="flex items-center justify-between px-1 mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-primary-foreground text-xs font-bold">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">CogniTrack</span>
          </Link>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
            className="rounded-full h-8 w-8"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search..." 
            className="pl-8 h-9 bg-accent/40 border-none focus-visible:ring-1 text-[13px]" 
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
