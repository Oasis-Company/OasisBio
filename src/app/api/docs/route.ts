import { NextResponse } from 'next/server';
import fsp from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'docs');

interface DocMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
}

function getCategoryFromPath(filePath: string): string {
  if (filePath.includes('/features/')) return 'features';
  if (filePath.includes('/guides/')) return 'guides';
  return 'specs';
}

async function getAllDocs(): Promise<DocMeta[]> {
  const docs: DocMeta[] = [];

  async function walkDirectory(dir: string, baseSlug: string = '') {
    const files = await fsp.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fsp.stat(filePath);

      if (stat.isDirectory()) {
        const newBaseSlug = baseSlug ? `${baseSlug}/${file}` : file;
        await walkDirectory(filePath, newBaseSlug);
      } else if (file.endsWith('.md')) {
        const fileContents = await fsp.readFile(filePath, 'utf8');
        const { data } = matter(fileContents);
        const slug = baseSlug ? `${baseSlug}/${file.replace('.md', '')}` : file.replace('.md', '');

        docs.push({
          slug,
          title: data.title || slug,
          description: data.description || '',
          category: getCategoryFromPath(filePath),
        });
      }
    }
  }

  await walkDirectory(docsDirectory);
  return docs;
}

export async function GET() {
  try {
    const docs = await getAllDocs();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error reading docs:', error);
    return NextResponse.json({ error: 'Failed to load docs' }, { status: 500 });
  }
}
