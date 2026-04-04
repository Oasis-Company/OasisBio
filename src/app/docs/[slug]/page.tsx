import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

const docsDirectory = path.join(process.cwd(), 'docs');

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getDocContent(slug: string) {
  const normalizedSlug = slug.replace(/-/g, '/');
  const possiblePaths = [
    path.join(docsDirectory, `${normalizedSlug}.md`),
    path.join(docsDirectory, normalizedSlug, 'index.md'),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        title: data.title || slug,
        description: data.description || '',
        content,
      };
    }
  }

  return null;
}

export async function generateStaticParams() {
  const docs: { slug: string }[] = [];

  function walkDirectory(dir: string, baseSlug: string = '') {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const newBaseSlug = baseSlug ? `${baseSlug}/${file}` : file;
        walkDirectory(filePath, newBaseSlug);
      } else if (file.endsWith('.md')) {
        const slug = baseSlug ? `${baseSlug}/${file.replace('.md', '')}` : file.replace('.md', '');
        docs.push({ slug });
      }
    });
  }

  walkDirectory(docsDirectory);
  return docs;
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getDocContent(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <a
            href="/docs"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Docs
          </a>
        </div>

        <article className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{doc.title}</h1>
          {doc.description && (
            <p className="text-xl text-gray-600 mb-8">{doc.description}</p>
          )}

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-2">{children}</li>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href as string}
                    className="text-black underline hover:text-gray-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
