import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BLOG_TAGS, type BlogTag } from '@/config/tags';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';

const contentDirectory = path.join(process.cwd(), 'content');

const blogTagSet = new Set<string>(BLOG_TAGS);

function localeDirectory(locale: Locale): string {
  return path.join(contentDirectory, locale);
}

function validateTags(tags: string[], slug: string): BlogTag[] {
  return tags.map((tag) => {
    if (!blogTagSet.has(tag)) {
      console.warn(`[mdx] Unknown tag "${tag}" in "${slug}". Register it in src/config/tags.ts`);
    }
    return tag as BlogTag;
  });
}

// 시리즈 자동 감지: "(1편", "(2편", "1편:", "(Part 1", "Part 1" 등의 패턴
function extractSeriesInfo(title: string, frontmatterSeries?: string): { series?: string; order?: number } {
  // frontmatter에 명시된 경우 우선
  if (frontmatterSeries) {
    const orderMatch = title.match(/\((\d+)편[:\)]?|\s(\d+)편[:\s]|Part\s*(\d+)/i);
    const order = orderMatch ? parseInt(orderMatch[1] || orderMatch[2] || orderMatch[3]) : undefined;
    return { series: frontmatterSeries, order };
  }

  // 자동 감지: "(N편" 또는 "N편:" 패턴 (영어는 "(Part N")
  const patterns = [
    /^(.+?)\s*\((\d+)편[:\)]?/,        // "제목 (1편:" or "제목 (1편)"
    /^(.+?)\s+(\d+)편[:\s]/,            // "제목 1편:"
    /^(.+?)\s*\(Part\s*(\d+)[:\)]?/i,   // "Title (Part 1:" or "Title (Part 1)"
    /^(.+?)\s*[-–]\s*Part\s*(\d+)/i,    // "Title - Part 1"
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
  /** `reading-time`이 계산한 분 단위 값. 표시 문구는 로케일 사전에서 만든다. */
  readingMinutes: number;
  series?: string;
  seriesOrder?: number;
  draft?: boolean;
  /** 이 글을 조회한 로케일 (링크·목록을 만들 때 기준이 되는 값) */
  locale: Locale;
  /** 실제 본문이 담긴 파일의 로케일. 폴백된 경우 기본 로케일이 된다. */
  contentLocale: Locale;
  /** 요청한 로케일의 번역본이 없어 기본 로케일 원문으로 대체된 경우 true */
  isFallback: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

// 개발 모드인지 확인
const isDev = process.env.NODE_ENV === 'development';

interface RawPost {
  data: Record<string, unknown>;
  content: string;
  locale: Locale;
}

/** `content/<locale>/<slug>.md(x)` 를 읽는다. 없으면 null. */
function readRawPost(slug: string, locale: Locale): RawPost | null {
  const dir = localeDirectory(locale);
  const candidates = [path.join(dir, `${slug}.md`), path.join(dir, `${slug}.mdx`)];
  const actualPath = candidates.find((candidate) => fs.existsSync(candidate));

  if (!actualPath) return null;

  const { data, content } = matter(fs.readFileSync(actualPath, 'utf8'));
  return { data: data as Record<string, unknown>, content, locale };
}

/**
 * 요청한 로케일의 원문을 읽되, 없으면 기본 로케일로 폴백한다.
 * 새 한국어 글이 번역 전이어도 `/en`에서 사라지지 않게 하기 위한 장치.
 */
function readPostWithFallback(slug: string, locale: Locale): RawPost | null {
  return readRawPost(slug, locale) ?? (locale === DEFAULT_LOCALE ? null : readRawPost(slug, DEFAULT_LOCALE));
}

function listSlugs(locale: Locale): string[] {
  const dir = localeDirectory(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => path.basename(file, path.extname(file)));
}

/** 기본 로케일과 요청 로케일에 존재하는 slug의 합집합 */
function listAllSlugs(locale: Locale): string[] {
  const slugs = new Set(listSlugs(DEFAULT_LOCALE));
  listSlugs(locale).forEach((slug) => slugs.add(slug));
  return Array.from(slugs);
}

function toPostMeta(slug: string, raw: RawPost, requestedLocale: Locale): PostMeta {
  const data = raw.data;
  const title = (data.title as string) || slug;
  const { series, order } = extractSeriesInfo(title, data.series as string | undefined);

  return {
    slug,
    title,
    description: (data.description as string) || '',
    date: (data.date as string) || new Date().toISOString(),
    tags: validateTags((data.tags as string[]) || [], slug),
    thumbnail: data.thumbnail as string | undefined,
    readingMinutes: Math.max(1, Math.ceil(readingTime(raw.content).minutes)),
    series,
    seriesOrder: order,
    draft: (data.draft as boolean) || false,
    locale: requestedLocale,
    contentLocale: raw.locale,
    isFallback: raw.locale !== requestedLocale,
  };
}

export function getAllPosts(locale: Locale = DEFAULT_LOCALE): PostMeta[] {
  const posts = listAllSlugs(locale)
    .map((slug) => {
      const raw = readPostWithFallback(slug, locale);
      return raw ? toPostMeta(slug, raw, locale) : null;
    })
    .filter((post): post is PostMeta => post !== null);

  // 프로덕션에서는 draft 제외, 개발 모드에서는 모두 표시
  const filteredPosts = isDev ? posts : posts.filter((post) => !post.draft);

  return filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Post | null {
  const raw = readPostWithFallback(slug, locale);
  if (!raw) return null;

  // 프로덕션에서 draft 글 접근 시 null 반환
  if (!isDev && raw.data.draft) {
    return null;
  }

  return {
    ...toPostMeta(slug, raw, locale),
    content: raw.content,
  };
}

/** 해당 slug에 요청 로케일의 실제 번역본이 있는지 (폴백이 아닌지) */
export function hasTranslation(slug: string, locale: Locale): boolean {
  return readRawPost(slug, locale) !== null;
}

/** 이 slug가 실제 번역본을 가진 로케일 목록 */
export function getTranslatedLocales(slug: string): Locale[] {
  return LOCALES.filter((locale) => hasTranslation(slug, locale));
}

export function getRecentPosts(count: number = 5, locale: Locale = DEFAULT_LOCALE): PostMeta[] {
  return getAllPosts(locale).slice(0, count);
}

// 같은 시리즈의 모든 글 가져오기 (순서대로 정렬)
export function getSeriesPosts(seriesName: string, locale: Locale = DEFAULT_LOCALE): PostMeta[] {
  return getAllPosts(locale)
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

  const posts = getSeriesPosts(currentPost.series, currentPost.locale);
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

  const allPosts = getAllPosts(currentPost.locale);

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
export function getAllTags(locale: Locale = DEFAULT_LOCALE): { tag: string; count: number }[] {
  const posts = getAllPosts(locale);
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
export function getPostsByTag(tag: string, locale: Locale = DEFAULT_LOCALE): PostMeta[] {
  return getAllPosts(locale).filter((post) => (post.tags as string[] | undefined)?.includes(tag));
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
