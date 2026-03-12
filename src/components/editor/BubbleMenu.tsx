'use client';

import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import { Editor, useEditorState } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  CheckSquare,
  Code,
  Heading1,
  Heading2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BubbleMenuProps {
  editor: Editor | null;
}

export default function BubbleMenu({ editor }: BubbleMenuProps) {
  const states = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isHeading1: ctx.editor.isActive('heading', { level: 1 }),
      isHeading2: ctx.editor.isActive('heading', { level: 2 }),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isTaskList: ctx.editor.isActive('taskList'),
      isCode: ctx.editor.isActive('code'),
    }),
  });

  if (!editor || !states) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 p-1 rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={states.isBold ? 'bg-accent text-accent-foreground' : ''}
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={states.isItalic ? 'bg-accent text-accent-foreground' : ''}
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      
      <Separator orientation="vertical" className="h-4 mx-1" />
      
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={states.isHeading1 ? 'bg-accent text-accent-foreground' : ''}
      >
        <Heading1 className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={states.isHeading2 ? 'bg-accent text-accent-foreground' : ''}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </Button>

      <Separator orientation="vertical" className="h-4 mx-1" />

      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={states.isBulletList ? 'bg-accent text-accent-foreground' : ''}
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={states.isOrderedList ? 'bg-accent text-accent-foreground' : ''}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={states.isTaskList ? 'bg-accent text-accent-foreground' : ''}
      >
        <CheckSquare className="h-3.5 w-3.5" />
      </Button>
      
      <Separator orientation="vertical" className="h-4 mx-1" />

      <Button
        variant="ghost"
        size="icon-xs"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={states.isCode ? 'bg-accent text-accent-foreground' : ''}
      >
        <Code className="h-3.5 w-3.5" />
      </Button>
    </TiptapBubbleMenu>
  );
}
