import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { extractTasks } from '@/lib/parser';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, content } = await request.json();

  try {
    const tasks = extractTasks(content);

    const updatedDocument = await prisma.$transaction(async (tx) => {
      // 1. Update Document
      const doc = await tx.document.upsert({
        where: { id },
        update: { title, content },
        create: { id, title, content },
      });

      // 2. Clear old tasks
      await tx.task.deleteMany({
        where: { documentId: id },
      });

      // 3. Create new tasks
      if (tasks.length > 0) {
        await tx.task.createMany({
          data: tasks.map((t) => ({
            documentId: id,
            content: t.content,
            status: t.status,
          })),
        });
      }

      return doc;
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error saving document:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}
