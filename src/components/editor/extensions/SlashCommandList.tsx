import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Heading1, Heading2, List, ListOrdered, CheckSquare, Quote, Code, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  title: string;
  icon: string;
  command: (props: { editor: any; range: any }) => void;
}

const SlashCommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  const getIcon = (iconCode: string) => {
    switch (iconCode) {
      case 'H1': return <Heading1 className="w-4 h-4" />;
      case 'H2': return <Heading2 className="w-4 h-4" />;
      case 'UL': return <List className="w-4 h-4" />;
      case 'OL': return <ListOrdered className="w-4 h-4" />;
      case 'CH': return <CheckSquare className="w-4 h-4" />;
      case 'BQ': return <Quote className="w-4 h-4" />;
      case 'CB': return <Code className="w-4 h-4" />;
      case 'LINK': return <LinkIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  if (!props.items.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0.5 p-1 rounded-md border bg-popover text-popover-foreground shadow-md w-48 overflow-hidden z-50">
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Format
      </div>
      {props.items.map((item: CommandItem, index: number) => (
        <button
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm text-left w-full hover:bg-accent hover:text-accent-foreground",
            index === selectedIndex ? "bg-accent text-accent-foreground" : ""
          )}
          key={index}
          onClick={() => selectItem(index)}
        >
          {getIcon(item.icon)}
          {item.title}
        </button>
      ))}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';

export default SlashCommandList;
