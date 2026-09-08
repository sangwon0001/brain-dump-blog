import type { Locale } from '@/i18n/config';

export const BLOG_TAGS = [
  // Nav tags (상단 네비에 표시)
  'AI', 'Develop', 'Thoughts', 'Blockchain', 'Daily',
  // Content tags
  'Tech', 'claude-code', 'nextjs', 'blog', 'seo', 'theming',
  'persona', 'writing', 'search', 'rss', 'og-image',
  'giscus', 'ux', 'prisma', 'neon', 'analytics',
  'future', 'singapore',
  'framer-motion', 'animation', '아키텍트', '1인개발',
  '시스템설계', 'semiconductor', 'llm', 'engineering', 'automation',
  'ai-agent', 'governance', 'adr', 'roadmap', 'skill', 'workflow',
  'Structure', 'Cognition', 'BufferLine',
  // New Tags added
  'OpenClaw', 'WebMCP', 'Matrix', 'Tech Insight',
  'Education', 'System', 'complexity', 'kpop',
  'accounting', 'cli', 'PC주의', '추상화',
  'AI Narrator',
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export const NAV_TAGS: readonly BlogTag[] = ['AI', 'Develop', 'Thoughts', 'AI Narrator', 'Blockchain', 'Daily'];

/**
 * 태그 키는 URL과 frontmatter의 정본이라 로케일과 무관하게 고정한다.
 * 화면에 보이는 이름만 로케일별로 갈아끼운다. (등록되지 않은 태그는 키 그대로)
 */
export const TAG_LABELS: Record<Locale, Partial<Record<BlogTag, string>>> = {
  ko: {
    'AI Narrator': 'AI 화자',
  },
  en: {
    '아키텍트': 'Architect',
    '1인개발': 'Solo Dev',
    '시스템설계': 'System Design',
    'PC주의': 'Political Correctness',
    '추상화': 'Abstraction',
  },
};

export function tagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS[locale][tag as BlogTag] ?? tag;
}

/**
 * 태그 페이지 상단에 붙는 설명.
 * 카테고리처럼 쓰는 태그(주로 NAV_TAGS)에만 달면 된다. 없으면 글 목록만 나온다.
 */
export const TAG_DESCRIPTIONS: Record<Locale, Partial<Record<BlogTag, string>>> = {
  ko: {
    'AI Narrator': 'AI가 화자인 글. 내가 대화 상대일 뿐, 쓰는 쪽은 AI다.',
  },
  en: {
    'AI Narrator': 'Posts where the AI is the narrator. I\'m just the other side of the conversation; the machine does the writing.',
  },
};

export function tagDescription(tag: string, locale: Locale): string | undefined {
  return TAG_DESCRIPTIONS[locale][tag as BlogTag];
}
