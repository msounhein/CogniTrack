import prisma from '@/lib/prisma';
import Editor from '@/components/Editor';
import { notFound } from 'next/navigation';

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Try to find the document. If it doesn't exist, we'll create it on the first save in the Editor component.
  // For now, let's just fetch it to pass initial values.
  const document = await prisma.document.findUnique({
    where: { id },
  });

  return (
    <div className="flex-1 overflow-hidden p-4">
      <Editor 
        id={id} 
        initialTitle={document?.title} 
        initialContent={document?.content} 
      />
    </div>
  );
}
