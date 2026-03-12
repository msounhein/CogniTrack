'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import BubbleMenu from './editor/BubbleMenu';
import SlashMenu from './editor/SlashMenu';

interface EditorProps {
  id: string;
  initialTitle?: string;
  initialContent?: string;
}

export default function AdvancedEditor({ id, initialTitle = 'Untitled Note', initialContent = '' }: EditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Typography,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[500px] tiptap',
      },
    },
    onUpdate: ({ editor }) => {
      handleAutoSave(title, editor.getHTML());
    },
  });

  const saveNote = useCallback(async (currentTitle: string, currentContent: string) => {
    setSaveStatus('saving');
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: currentTitle, content: currentContent }),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    }
  }, [id]);

  const handleAutoSave = (currentTitle: string, currentContent: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      saveNote(currentTitle, currentContent);
    }, 2000);
  };

  useEffect(() => {
    if (editor) {
      handleAutoSave(title, editor.getHTML());
    }
  }, [title, editor]);

  return (
    <Card className="flex flex-col h-full w-full border-none shadow-none bg-transparent">
      <CardHeader className="pb-2 px-0 w-full">
        <div className="flex justify-between items-center mb-4 w-full gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent h-auto flex-1"
            placeholder="Note Title"
          />
          <div className="text-xs text-muted-foreground italic bg-accent/50 px-2 py-1 rounded">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'All changes saved'}
            {saveStatus === 'error' && 'Error saving changes'}
            {saveStatus === 'idle' && 'Saved'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-0 pb-6 overflow-y-auto">
        <BubbleMenu editor={editor} />
        <SlashMenu editor={editor} />
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
}
