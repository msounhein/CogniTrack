import prisma from '@/lib/prisma';
import AdvancedEditor from '@/components/AdvancedEditor';
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
    <div className="flex-1 h-full w-full">
      <AdvancedEditor 
        id={id} 
        initialTitle={document?.title} 
        initialContent={document?.content} 
      />
    </div>
  );
}
