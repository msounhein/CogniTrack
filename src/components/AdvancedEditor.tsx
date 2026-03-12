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

  // Notify sidebar to refresh when saved
  useEffect(() => {
    if (saveStatus === 'saved') {
      window.dispatchEvent(new CustomEvent('note-saved'));
    }
  }, [saveStatus]);

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex justify-between items-end mb-12 w-full gap-4 border-b pb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl sm:text-5xl font-extrabold border-none px-0 focus-visible:ring-0 bg-transparent h-auto flex-1 tracking-tight"
          placeholder="Note Title"
        />
        <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border mb-2 shrink-0">
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Synced'}
          {saveStatus === 'error' && 'Sync Error'}
          {saveStatus === 'idle' && 'Synced'}
        </div>
      </div>
      
      <div className="flex-1 relative w-full">
        <BubbleMenu editor={editor} />
        <SlashMenu editor={editor} />
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
}
