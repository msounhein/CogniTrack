import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CodeBlockComponent({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: any) {
  return (
    <NodeViewWrapper className="relative group my-6">
      <div
        className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        contentEditable={false}
      >
        <Select
          defaultValue={defaultLanguage || 'null'}
          onValueChange={(value) => updateAttributes({ language: value })}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs bg-zinc-900 border-zinc-700 text-zinc-300">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">auto</SelectItem>
            {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
              <SelectItem key={index} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
