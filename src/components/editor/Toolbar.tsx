'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Code,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Strikethrough,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from 'react';

interface ToolbarProps {
  editor: Editor | null;
}

const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { name: 'Times New Roman', value: 'Comic Sans MS, Comic Sans' }, // Fun alternative, but let's stick to standard names where possible
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
];

const FONT_SIZES = [
  { name: 'Small', value: '12px' },
  { name: 'Normal', value: '16px' },
  { name: 'Large', value: '20px' },
  { name: 'Huge', value: '24px' },
];

export default function Toolbar({ editor }: ToolbarProps) {
  const setLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const { empty, from } = editor.state.selection;
    if (empty) {
      editor.chain().focus().insertContent('link').setTextSelection({ from, to: from + 4 }).setLink({ href: '' }).run();
    } else {
      editor.chain().focus().setLink({ href: '' }).run();
    }
  }, [editor]);

  const states = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          isBold: false,
          isItalic: false,
          isStrike: false,
          isHeading1: false,
          isHeading2: false,
          isBulletList: false,
          isOrderedList: false,
          isTaskList: false,
          isBlockquote: false,
          isCodeBlock: false,
          isLink: false,
          canUndo: false,
          canRedo: false,
          currentFont: 'Inter',
          currentSize: '16px',
        };
      }
      return {
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        isHeading1: ctx.editor.isActive('heading', { level: 1 }),
        isHeading2: ctx.editor.isActive('heading', { level: 2 }),
        isBulletList: ctx.editor.isActive('bulletList'),
        isOrderedList: ctx.editor.isActive('orderedList'),
        isTaskList: ctx.editor.isActive('taskList'),
        isBlockquote: ctx.editor.isActive('blockquote'),
        isCodeBlock: ctx.editor.isActive('codeBlock'),
        isLink: ctx.editor.isActive('link'),
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
        currentFont: ctx.editor.getAttributes('textStyle').fontFamily || 'Inter',
        currentSize: ctx.editor.getAttributes('textStyle').fontSize || '16px',
      };
    },
  });

  if (!editor || !states) return null;

  return (
    <div className="border-b bg-muted/20 px-3 py-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mr-1">
        <Select 
          value={states.currentFont} 
          onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
        >
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map(font => (
              <SelectItem key={font.value} value={font.value} className="text-xs">
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={states.currentSize} 
          onValueChange={(value) => editor.chain().focus().setFontSize(value).run()}
        >
          <SelectTrigger className="h-8 w-[90px] text-xs">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map(size => (
              <SelectItem key={size.value} value={size.value} className="text-xs">
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!states.canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!states.canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={states.isHeading1 ? 'bg-accent text-accent-foreground' : ''}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={states.isHeading2 ? 'bg-accent text-accent-foreground' : ''}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={states.isBold ? 'bg-accent text-accent-foreground' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={states.isItalic ? 'bg-accent text-accent-foreground' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={states.isStrike ? 'bg-accent text-accent-foreground' : ''}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={setLink}
          className={states.isLink ? 'bg-accent text-accent-foreground' : ''}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={states.isBulletList ? 'bg-accent text-accent-foreground' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={states.isOrderedList ? 'bg-accent text-accent-foreground' : ''}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={states.isTaskList ? 'bg-accent text-accent-foreground' : ''}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={states.isBlockquote ? 'bg-accent text-accent-foreground' : ''}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={states.isCodeBlock ? 'bg-accent text-accent-foreground' : ''}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
