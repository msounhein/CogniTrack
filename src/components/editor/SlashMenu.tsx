'use client';

import { FloatingMenu } from '@tiptap/react/menus';
import { Editor } from '@tiptap/react';
import { 
  Heading1, 
  Heading2, 
  List, 
  CheckSquare,
  Code,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlashMenuProps {
  editor: Editor | null;
}

export default function SlashMenu({ editor }: SlashMenuProps) {
  if (!editor) return null;

  return (
    <FloatingMenu
      editor={editor}
      className="flex flex-col gap-0.5 p-1 rounded-md border bg-popover text-popover-foreground shadow-md min-w-[180px]"
    >
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Quick Insert
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 h-9"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
        <span className="text-sm">Heading 1</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 h-9"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
        <span className="text-sm">Heading 2</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 h-9"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
        <span className="text-sm">Bullet List</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 h-9"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <CheckSquare className="h-4 w-4" />
        <span className="text-sm">Task List</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 h-9"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
        <span className="text-sm">Quote</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start gap-2 px-2 h-9"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="h-4 w-4" />
        <span className="text-sm">Code Block</span>
      </Button>
    </FloatingMenu>
  );
}
