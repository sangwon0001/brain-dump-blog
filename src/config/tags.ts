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
  'ai-agent', 'governance',
  'Structure', 'Cognition', 'BufferLine',
  // New Tags added
  'OpenClaw', 'WebMCP', 'Matrix', 'Tech Insight',
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export const NAV_TAGS: readonly BlogTag[] = ['AI', 'Develop', 'Thoughts', 'Blockchain', 'Daily'];
