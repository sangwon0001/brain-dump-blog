import { NextResponse } from 'next/server';

const AI_DOCS = [
  { slug: 'blog-guide', title: '블로그 글 작성 가이드' },
  { slug: 'persona_base', title: '기본 페르소나 (구조 디버거)' },
  { slug: 'persona_blogger', title: '블로거 페르소나 (사고 기록자)' },
  { slug: 'persona_commenter', title: '댓글 페르소나 (논점 교정자)' },
  { slug: 'template', title: '템플릿' },
];

export async function GET() {
  const baseUrl = 'https://blog.sangwon0001.xyz/api/ai-guide';

  const content = `# AI Writing Guide - 뇌 용량 확보용

## 문서 목록
${AI_DOCS.map(doc => `- ${doc.title}: ${baseUrl}/${doc.slug}`).join('\n')}

## 사용법
AI에게 글 요청 시:
${baseUrl}/blog-guide 읽고,
${baseUrl}/persona_base 읽고,
${baseUrl}/persona_blogger 읽고,
[주제]에 대한 블로그 글 써줘.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
