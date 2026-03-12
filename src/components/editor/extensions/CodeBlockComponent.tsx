import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}: any) {
  const { language: defaultLanguage } = node.attrs;

  // Try to determine what language lowlight auto-detected
  const displayLanguage = useMemo(() => {
    if (defaultLanguage) return defaultLanguage;
    if (!node.textContent) return 'auto';
    
    try {
      const result = extension.options.lowlight.highlightAuto(node.textContent);
      return result.data?.language || 'auto';
    } catch (e) {
      return 'auto';
    }
  }, [defaultLanguage, node.textContent, extension]);

  return (
    <NodeViewWrapper className="relative group my-6">
      <div
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        contentEditable={false}
      >
        <Select
          value={defaultLanguage || 'auto'}
          onValueChange={(value) => updateAttributes({ language: value === 'auto' ? null : value })}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs bg-zinc-900 border-zinc-700 text-zinc-300">
            <SelectValue placeholder="Language">
              {defaultLanguage ? defaultLanguage : `Auto (${displayLanguage !== 'auto' ? displayLanguage : '...'})`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto Detect</SelectItem>
            {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
              <SelectItem key={index} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <pre className="hljs">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
