import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all folders with their nested subfolders and documents
    // Note: Prisma 7 doesn't support recursive include for deep nesting easily, 
    // so we fetch all and build the tree in the frontend for simplicity in this MVP.
    const folders = await prisma.folder.findMany({
      include: {
        documents: {
          select: {
            id: true,
            title: true,
            updatedAt: true,
          }
        }
      }
    });

    const rootDocuments = await prisma.document.findMany({
      where: {
        folderId: null
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ folders, rootDocuments });
  } catch (error) {
    console.error('Error fetching tree:', error);
    return NextResponse.json({ error: 'Failed to fetch tree' }, { status: 500 });
  }
}
