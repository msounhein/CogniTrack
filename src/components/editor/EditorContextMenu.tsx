import React from 'react';
import { Editor, useEditorState } from '@tiptap/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from '@/components/ui/context-menu';
import { Bold, Italic, Strikethrough, Link as LinkIcon, Unlink } from 'lucide-react';

interface EditorContextMenuProps {
  children: React.ReactNode;
  editor: Editor | null;
}

const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { name: 'Times New Roman', value: 'Comic Sans MS, Comic Sans' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
];

const FONT_SIZES = [
  { name: 'Small (12px)', value: '12px' },
  { name: 'Normal (16px)', value: '16px' },
  { name: 'Large (20px)', value: '20px' },
  { name: 'Huge (24px)', value: '24px' },
];

export function EditorContextMenu({ children, editor }: EditorContextMenuProps) {
  if (!editor) return <>{children}</>;

  const states = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;
      return {
        isLink: ctx.editor.isActive('link'),
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        fontFamily: ctx.editor.getAttributes('textStyle').fontFamily || 'Inter',
        fontSize: ctx.editor.getAttributes('textStyle').fontSize || '16px',
        linkHref: ctx.editor.getAttributes('link').href,
      };
    },
  });

  if (!states) return <>{children}</>;

  const handleEditLink = () => {
    // We prompt for the new URL. Since the context menu closes on click, this is a clean way to handle it.
    const url = window.prompt('Update URL', states.linkHref || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    let validUrl = url;
    if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('mailto:') && !validUrl.startsWith('tel:')) {
      validUrl = `https://${validUrl}`;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: validUrl }).run();
  };

  const handleOpenLink = () => {
    if (states.linkHref) {
      window.open(states.linkHref, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="w-full h-full flex-1">
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 z-50">
        {states.isLink && (
          <>
            <ContextMenuItem onClick={handleEditLink} className="cursor-pointer">
              <LinkIcon className="mr-2 h-4 w-4" />
              Edit Link
            </ContextMenuItem>
            <ContextMenuItem onClick={handleOpenLink} className="cursor-pointer">
              <LinkIcon className="mr-2 h-4 w-4 opacity-0" />
              Open Link in New Tab
            </ContextMenuItem>
            <ContextMenuItem onClick={() => editor.chain().focus().unsetLink().run()} className="cursor-pointer text-destructive focus:text-destructive">
              <Unlink className="mr-2 h-4 w-4" />
              Remove Link
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem onClick={() => editor.chain().focus().toggleBold().run()} className="cursor-pointer">
          <Bold className="mr-2 h-4 w-4" />
          Bold
        </ContextMenuItem>
        <ContextMenuItem onClick={() => editor.chain().focus().toggleItalic().run()} className="cursor-pointer">
          <Italic className="mr-2 h-4 w-4" />
          Italic
        </ContextMenuItem>
        <ContextMenuItem onClick={() => editor.chain().focus().toggleStrike().run()} className="cursor-pointer">
          <Strikethrough className="mr-2 h-4 w-4" />
          Strikethrough
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="cursor-pointer">Font Family</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 z-50">
            <ContextMenuRadioGroup value={states.fontFamily} onValueChange={(val) => editor.chain().focus().setFontFamily(val).run()}>
              {FONT_FAMILIES.map((font) => (
                <ContextMenuRadioItem key={font.value} value={font.value} className="cursor-pointer">
                  {font.name}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger className="cursor-pointer">Font Size</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 z-50">
            <ContextMenuRadioGroup value={states.fontSize} onValueChange={(val) => editor.chain().focus().setFontSize(val).run()}>
              {FONT_SIZES.map((size) => (
                <ContextMenuRadioItem key={size.value} value={size.value} className="cursor-pointer">
                  {size.name}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
