import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { title, content, folderId } = await request.json();
    const document = await prisma.document.create({
      data: {
        title: title || 'Untitled Note',
        content: content || '',
        folderId: folderId || null,
      },
    });
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
