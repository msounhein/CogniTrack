'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import ListKeymap from '@tiptap/extension-list-keymap';
import Link from '@tiptap/extension-link';
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import CodeBlockComponent from './editor/extensions/CodeBlockComponent';
import { SlashCommand } from './editor/extensions/slashCommand';
import suggestion from './editor/extensions/slashSuggestion';
import BubbleMenu from './editor/BubbleMenu';
import LinkMenu from './editor/LinkMenu';
import Toolbar from './editor/Toolbar';
import { EditorContextMenu } from './editor/EditorContextMenu';

const lowlight = createLowlight(common);

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
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: true,
        orderedList: true,
        codeBlock: false,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      ListKeymap,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Typography,
      TextStyle,
      FontFamily,
      FontSize,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      SlashCommand.configure({
        suggestion,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[500px] tiptap px-4 py-4',
      },
    },
    onCreate: ({ editor }) => {
      console.log('Editor Created');
    },
    onUpdate: ({ editor }) => {
      console.log('Editor Updated:', editor.getHTML());
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
    <div className="flex-1 h-full w-full bg-accent/5 overflow-y-auto px-4 py-8 sm:px-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm min-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
          <Toolbar editor={editor} />
          
          <div className="px-8 pt-12 sm:px-16 sm:pt-20">
            <div className="flex justify-between items-end mb-12 w-full gap-4 border-b pb-6">
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
          </div>
          
          <div className="flex-1 relative px-8 pb-12 sm:px-16 sm:pb-20">
            <EditorContextMenu editor={editor}>
              <BubbleMenu editor={editor} />
              <LinkMenu editor={editor} />
              <EditorContent editor={editor} className="w-full h-full" />
            </EditorContextMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
