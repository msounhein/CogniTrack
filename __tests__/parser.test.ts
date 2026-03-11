// __tests__/parser.test.ts
import { extractTasks } from '../src/lib/parser';
import { describe, it, expect } from 'vitest';

describe('Task Extraction', () => {
  it('extracts tasks correctly', () => {
    const markdown = `- [ ] Task 1\n- [x] Task 2\nRegular text`;
    const tasks = extractTasks(markdown);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].status).toBe('todo');
    expect(tasks[1].status).toBe('done');
  });
});
