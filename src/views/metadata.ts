import type { Metadata } from 'next';
import { getDictionary } from '@/i18n';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_TAGS,
  OG_LOCALES,
  localizePath,
  type Locale,
} from '@/i18n/config';
import { getPostBySlug, getTranslatedLocales } from '@/lib/mdx';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.sangwon0001.xyz';

/** 로케일 경로를 절대 URL로 */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localizePath(locale, path)}`;
}

/**
 * hreflang 세트를 만든다.
 * `availableLocales`를 좁히면 (예: 번역본이 없는 글) 없는 언어를 광고하지 않는다.
 */
export function buildAlternates(
  locale: Locale,
  path: string,
  availableLocales: readonly Locale[] = LOCALES
): Metadata['alternates'] {
  const languages: Record<string, string> = {};

  availableLocales.forEach((available) => {
    languages[LOCALE_TAGS[available]] = absoluteUrl(available, path);
  });

  if (availableLocales.includes(DEFAULT_LOCALE)) {
    languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, path);
  }

  return {
    canonical: absoluteUrl(locale, path),
    languages,
    // 모든 페이지에서 현재 로케일의 RSS를 자동 발견할 수 있게 한다
    types: {
      'application/rss+xml': `${SITE_URL}${localizePath(locale, '/feed.xml')}`,
    },
  };
}

function ogImageUrl(locale: Locale, title: string, category = ''): string {
  const params = new URLSearchParams({ title, locale });
  if (category) params.set('category', category);
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/** 홈 (루트 레이아웃의 기본 메타데이터를 로케일별로 덮어쓴다) */
export function buildHomeMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  const image = ogImageUrl(locale, t.site.name);

  return {
    // 홈은 "사이트명 | 사이트명"이 되지 않도록 템플릿을 건너뛴다
    title: { absolute: t.site.name },
    description: t.site.description,
    alternates: buildAlternates(locale, '/'),
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[locale],
      url: absoluteUrl(locale, '/'),
      siteName: t.site.name,
      title: t.site.name,
      description: t.site.description,
      images: [{ url: image, width: 1200, height: 630, alt: t.site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.site.name,
      description: t.site.description,
      images: [image],
    },
  };
}

export function buildPostMetadata(locale: Locale, slug: string): Metadata {
  const post = getPostBySlug(slug, locale);
  if (!post) return { title: 'Not Found' };

  const t = getDictionary(locale);
  const path = `/posts/${slug}`;
  const image = ogImageUrl(locale, post.title, post.tags?.[0] || '');

  // 번역본이 실제로 있는 로케일만 hreflang으로 광고한다.
  const availableLocales = getTranslatedLocales(slug);

  return {
    title: post.title,
    description: post.description,
    alternates: buildAlternates(locale, path, availableLocales),
    openGraph: {
      type: 'article',
      locale: OG_LOCALES[locale],
      url: absoluteUrl(locale, path),
      siteName: t.site.name,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export function buildTagsMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);

  return {
    title: t.tags.title,
    description: t.tags.description,
    alternates: buildAlternates(locale, '/tags'),
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[locale],
      url: absoluteUrl(locale, '/tags'),
      siteName: t.site.name,
      title: `${t.tags.title} | ${t.site.name}`,
      description: t.tags.description,
    },
  };
}

export function buildTagMetadata(locale: Locale, decodedTag: string): Metadata {
  const t = getDictionary(locale);
  const description = t.tags.taggedWith(decodedTag);
  const path = `/tags/${encodeURIComponent(decodedTag)}`;

  return {
    title: `#${decodedTag}`,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: 'website',
      locale: OG_LOCALES[locale],
      url: absoluteUrl(locale, path),
      siteName: t.site.name,
      title: `#${decodedTag} | ${t.site.name}`,
      description,
    },
  };
}
