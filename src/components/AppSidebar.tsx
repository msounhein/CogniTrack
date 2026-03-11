'use client';

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
import { LayoutDashboard, Plus, Search, FolderPlus, FilePlus } from 'lucide-react';
import Link from 'next/link';
import FileTree from './FileTree';
import { Input } from '@/components/ui/input';

export default function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2 mb-4">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">C</span>
          </div>
          <span className="font-bold text-lg">CogniTrack</span>
        </div>
        
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
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
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/tasks" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Task Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between pr-4">
            <SidebarGroupLabel>Files & Folders</SidebarGroupLabel>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors">
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors">
                <FilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <SidebarGroupContent>
            <FileTree />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
