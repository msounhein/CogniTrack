'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface EditorProps {
  id: string;
  initialTitle?: string;
  initialContent?: string;
}

export default function Editor({ id, initialTitle = 'Untitled Note', initialContent = '' }: EditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Auto-save after 2 seconds of inactivity
    timerRef.current = setTimeout(() => {
      saveNote(title, content);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, content, saveNote]);

  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] border-none shadow-none">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
            placeholder="Note Title"
          />
          <div className="text-sm text-muted-foreground italic">
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'All changes saved'}
            {saveStatus === 'error' && 'Error saving changes'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none bg-transparent outline-none font-mono text-sm leading-relaxed"
          placeholder="Start writing in markdown..."
        />
      </CardContent>
    </Card>
  );
}
