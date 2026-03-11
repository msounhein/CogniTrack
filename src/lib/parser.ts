// src/lib/parser.ts
export function extractTasks(markdown: string) {
  const tasks = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^- \[([ xX])\] (.*)/);
    if (match) {
      tasks.push({
        status: match[1].trim() ? 'done' : 'todo',
        content: match[2].trim()
      });
    }
  }
  return tasks;
}
