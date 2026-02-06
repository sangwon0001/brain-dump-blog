import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BLOG_TAGS, type BlogTag } from '@/config/tags';

const contentDirectory = path.join(process.cwd(), 'content');

const blogTagSet = new Set<string>(BLOG_TAGS);

function validateTags(tags: string[], slug: string): BlogTag[] {
  return tags.map((tag) => {
    if (!blogTagSet.has(tag)) {
      console.warn(`[mdx] Unknown tag "${tag}" in "${slug}". Register it in src/config/tags.ts`);
    }
    return tag as BlogTag;
  });
}

// 시리즈 자동 감지: "(1편", "(2편", "1편:", "Part 1" 등의 패턴
function extractSeriesInfo(title: string, frontmatterSeries?: string): { series?: string; order?: number } {
  // frontmatter에 명시된 경우 우선
  if (frontmatterSeries) {
    const orderMatch = title.match(/\((\d+)편[:\)]?|\s(\d+)편[:\s]|Part\s*(\d+)/i);
    const order = orderMatch ? parseInt(orderMatch[1] || orderMatch[2] || orderMatch[3]) : undefined;
    return { series: frontmatterSeries, order };
  }

  // 자동 감지: "(N편" 또는 "N편:" 패턴
  const patterns = [
    /^(.+?)\s*\((\d+)편[:\)]?/,      // "제목 (1편:" or "제목 (1편)"
    /^(.+?)\s+(\d+)편[:\s]/,          // "제목 1편:"
    /^(.+?)\s*[-–]\s*Part\s*(\d+)/i,  // "제목 - Part 1"
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return { series: match[1].trim(), order: parseInt(match[2]) };
    }
  }

  return {};
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: BlogTag[];
  thumbnail?: string;
  readingTime: string;
  series?: string;
  seriesOrder?: number;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

// 개발 모드인지 확인
const isDev = process.env.NODE_ENV === 'development';

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(contentDirectory).filter(
    (file) => file.endsWith('.md') || file.endsWith('.mdx')
  );

  const posts = files.map((file) => {
    const filePath = path.join(contentDirectory, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const slug = path.basename(file, path.extname(file));
    const title = data.title || slug;
    const { series, order } = extractSeriesInfo(title, data.series);

    return {
      slug,
      title,
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      tags: validateTags(data.tags || [], slug),
      thumbnail: data.thumbnail,
      readingTime: readingTime(content).text,
      series,
      seriesOrder: order,
      draft: data.draft || false,
    };
  });

  // 프로덕션에서는 draft 제외, 개발 모드에서는 모두 표시
  const filteredPosts = isDev ? posts : posts.filter((post) => !post.draft);

  return filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(contentDirectory, `${slug}.md`);
  const mdxPath = path.join(contentDirectory, `${slug}.mdx`);

  let actualPath = '';
  if (fs.existsSync(filePath)) {
    actualPath = filePath;
  } else if (fs.existsSync(mdxPath)) {
    actualPath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(actualPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 프로덕션에서 draft 글 접근 시 null 반환
  if (!isDev && data.draft) {
    return null;
  }

  const title = data.title || slug;
  const { series, order } = extractSeriesInfo(title, data.series);

  return {
    slug,
    title,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    tags: validateTags(data.tags || [], slug),
    thumbnail: data.thumbnail,
    readingTime: readingTime(content).text,
    series,
    seriesOrder: order,
    draft: data.draft || false,
    content,
  };
}

export function getRecentPosts(count: number = 5): PostMeta[] {
  return getAllPosts().slice(0, count);
}

// 같은 시리즈의 모든 글 가져오기 (순서대로 정렬)
export function getSeriesPosts(seriesName: string): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.series === seriesName)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

// 현재 글의 시리즈 정보 (이전/다음 포함)
export function getSeriesNavigation(currentPost: PostMeta): {
  series: string;
  posts: PostMeta[];
  currentIndex: number;
  prev?: PostMeta;
  next?: PostMeta;
} | null {
  if (!currentPost.series) return null;

  const posts = getSeriesPosts(currentPost.series);
  const currentIndex = posts.findIndex(
    (p) => p.slug === currentPost.slug
  );

  if (currentIndex === -1) return null;

  return {
    series: currentPost.series,
    posts,
    currentIndex,
    prev: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined,
  };
}

// 관련 글 추천 (같은 태그 기반, 현재 글 제외)
export function getRelatedPosts(currentPost: PostMeta, count: number = 3): PostMeta[] {
  if (!currentPost.tags || currentPost.tags.length === 0) return [];

  const allPosts = getAllPosts();

  // 태그 매칭 점수 계산
  const scored = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .filter((post) => !post.series || !currentPost.series || post.series !== currentPost.series) // 같은 시리즈는 제외 (둘 다 시리즈 없으면 통과)
    .map((post) => {
      const matchingTags = (post.tags || []).filter((tag) =>
        currentPost.tags!.includes(tag)
      ).length;
      return { post, score: matchingTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map(({ post }) => post);
}

// 모든 태그 가져오기 (사용 횟수 포함)
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCount = new Map<string, number>();

  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// 특정 태그의 글 가져오기
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => (post.tags as string[] | undefined)?.includes(tag));
}

// TOC를 위한 헤딩 추출
export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    toc.push({
      level,
      text,
      slug: slugify(text),
    });
  }

  return toc;
}
