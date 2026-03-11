// __tests__/parser.test.ts
import { extractTasks } from '../src/lib/parser';
import { describe, it, expect } from 'vitest';

describe('Task Extraction', () => {
  it('extracts tasks from markdown correctly', () => {
    const markdown = `- [ ] Task 1\n- [x] Task 2\nRegular text`;
    const tasks = extractTasks(markdown);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].content).toBe('Task 1');
    expect(tasks[0].status).toBe('todo');
    expect(tasks[1].content).toBe('Task 2');
    expect(tasks[1].status).toBe('done');
  });

  it('extracts tasks from Tiptap HTML correctly', () => {
    const html = `
      <ul data-type="taskList">
        <li data-checked="false" data-type="taskItem">
          <label><input type="checkbox"><span></span></label>
          <div><p>Task 1</p></div>
        </li>
        <li data-checked="true" data-type="taskItem">
          <label><input type="checkbox" checked="checked"><span></span></label>
          <div><p>Task 2</p></div>
        </li>
      </ul>
    `;
    const tasks = extractTasks(html);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].content).toBe('Task 1');
    expect(tasks[0].status).toBe('todo');
    expect(tasks[1].content).toBe('Task 2');
    expect(tasks[1].status).toBe('done');
  });
});
