import { getAllPosts } from '@/lib/mdx';
import { getDictionary } from '@/i18n';
import { LOCALE_TAGS, localizePath, type Locale } from '@/i18n/config';
import { SITE_URL, absoluteUrl } from './metadata';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 로케일별 RSS 피드. ko는 `/feed.xml`, en은 `/en/feed.xml`. */
export function buildFeedResponse(locale: Locale): Response {
  const t = getDictionary(locale);
  const posts = getAllPosts(locale).slice(0, 20);
  const feedUrl = `${SITE_URL}${localizePath(locale, '/feed.xml')}`;

  const items = posts
    .map((post) => {
      const url = absoluteUrl(locale, `/posts/${post.slug}`);
      const pubDate = new Date(post.date).toUTCString();

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t.site.rssTitle)}</title>
    <link>${absoluteUrl(locale, '/')}</link>
    <description>${escapeXml(t.site.rssDescription)}</description>
    <language>${LOCALE_TAGS[locale]}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
