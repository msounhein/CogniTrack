import { BubbleMenu as TiptapBubbleMenu, useEditorState } from '@tiptap/react';
import { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface LinkMenuProps {
  editor: Editor | null;
}

export default function LinkMenu({ editor }: LinkMenuProps) {
  const [url, setUrl] = useState('');

  const isLink = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return false;
      return ctx.editor.isActive('link');
    },
  });

  useEffect(() => {
    if (editor && isLink) {
      setUrl(editor.getAttributes('link').href || '');
    }
  }, [editor, isLink]);

  if (!editor || !isLink) return null;

  const saveLink = () => {
    if (url) {
      let validUrl = url;
      if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('mailto:') && !validUrl.startsWith('tel:')) {
        validUrl = `https://${validUrl}`;
      }
      editor.chain().focus().setLink({ href: validUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive('link')}
      tippyOptions={{ placement: 'top', duration: 100 }}
      className="flex items-center gap-1 p-1 bg-popover rounded-md shadow-md border min-w-[250px] z-50"
    >
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL..."
        className="h-8 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-transparent flex-1"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            saveLink();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            editor.commands.focus();
          }
        }}
      />
      <Button size="icon-xs" variant="ghost" onClick={saveLink} className="h-7 w-7">
        <Check className="h-4 w-4 text-green-500" />
      </Button>
      <Button size="icon-xs" variant="ghost" onClick={() => editor.chain().focus().unsetLink().run()} className="h-7 w-7">
        <X className="h-4 w-4 text-destructive" />
      </Button>
    </TiptapBubbleMenu>
  );
}
