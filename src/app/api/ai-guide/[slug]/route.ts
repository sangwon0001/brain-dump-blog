import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AI_DOCS_PATH = path.join(process.cwd(), 'public/ai');

const ALLOWED_DOCS = [
  'blog-guide',
  'persona_base',
  'persona_blogger',
  'persona_commenter',
  'template',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!ALLOWED_DOCS.includes(slug)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fileName = `${slug}.md`;
  const filePath = path.join(AI_DOCS_PATH, fileName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
