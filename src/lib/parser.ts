// src/lib/parser.ts
export function extractTasks(content: string) {
  const tasks: { status: string; content: string }[] = [];

  // Handle Markdown format: - [ ] Task text
  const markdownLines = content.split('\n');
  for (const line of markdownLines) {
    const match = line.match(/^- \[([ xX])\] (.*)/);
    if (match) {
      tasks.push({
        status: match[1].trim() ? 'done' : 'todo',
        content: match[2].trim()
      });
    }
  }

  // Handle Tiptap HTML format
  // We'll look for taskItem <li> tags and extract data-checked and the content from the first <p>
  const liTaskRegex = /<li [^>]*data-type="taskItem"[^>]*>[\s\S]*?<\/li>/g;
  const checkedRegex = /data-checked="([^"]*)"/;
  const contentRegex = /<div>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>/;

  let liMatch;
  while ((liMatch = liTaskRegex.exec(content)) !== null) {
    const liContent = liMatch[0];
    
    const checkedMatch = liContent.match(checkedRegex);
    const contentMatch = liContent.match(contentRegex);

    if (checkedMatch && contentMatch) {
      tasks.push({
        status: checkedMatch[1] === 'true' ? 'done' : 'todo',
        content: contentMatch[1].replace(/<[^>]*>/g, '').trim()
      });
    }
  }

  return tasks;
}
