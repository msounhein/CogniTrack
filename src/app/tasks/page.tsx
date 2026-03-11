import prisma from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    include: {
      document: true
    },
    orderBy: {
      documentId: 'asc'
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Global Task Dashboard</h1>
      
      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No tasks found. Write some notes with `- [ ]` to see them here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:border-primary transition-colors cursor-default">
              <CardContent className="pt-6 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'done'} 
                      readOnly 
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                      {task.content}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-7">
                    From: <Link href={`/notes/${task.documentId}`} className="hover:underline">{task.document.title}</Link>
                  </div>
                </div>
                <Badge variant={task.status === 'done' ? 'secondary' : 'outline'}>
                  {task.status === 'done' ? 'Done' : 'Todo'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
