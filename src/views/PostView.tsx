import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPostBySlug,
  getAllPosts,
  getSeriesNavigation,
  getRelatedPosts,
  extractToc,
} from '@/lib/mdx';
import { NAV_TAGS, tagLabel } from '@/config/tags';
import MDXContent from '@/components/MDXContent';
import Header from '@/components/Header';
import PostPageHeader from '@/components/PostPageHeader';
import SeriesNav from '@/components/SeriesNav';
import RelatedPostsWithContext from '@/components/RelatedPostsWithContext';
import TableOfContents from '@/components/TableOfContents';
import { ArticleJsonLd } from '@/components/JsonLd';
import ReadingProgress from '@/components/ReadingProgress';
import Comments from '@/components/Comments';
import { ViewCounter } from '@/components/ViewCounter';
import { getDictionary } from '@/i18n';
import { LOCALE_TAGS, localizePath, type Locale } from '@/i18n/config';
import { absoluteUrl } from './metadata';

interface PostViewProps {
  locale: Locale;
  slug: string;
}

export default function PostView({ locale, slug }: PostViewProps) {
  const t = getDictionary(locale);
  const post = getPostBySlug(slug, locale);
  const allPosts = getAllPosts(locale);

  if (!post) {
    notFound();
  }

  const seriesNav = getSeriesNavigation(post);
  const relatedPosts = getRelatedPosts(post, 6);
  const toc = extractToc(post.content);

  const url = absoluteUrl(locale, `/posts/${slug}`);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedTime={post.date}
        url={url}
        tags={post.tags}
        locale={locale}
      />
      <ReadingProgress />
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Suspense fallback={<Header navTags={[...NAV_TAGS]} posts={allPosts} />}>
          <PostPageHeader posts={allPosts} />
        </Suspense>

      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Post Header */}
        <header className="pt-8 sm:pt-12 pb-8 sm:pb-10 border-b border-[var(--border-primary)]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--text-muted)] mb-4 sm:mb-6">
            {post.tags && post.tags[0] && (
              <Link
                href={localizePath(locale, `/tags/${encodeURIComponent(post.tags[0])}`)}
                className="bg-[var(--accent-bg)] text-[var(--accent-primary)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
              >
                {tagLabel(post.tags[0], locale)}
              </Link>
            )}
            <span className="text-[var(--border-secondary)]">·</span>
            <time dateTime={post.date} className="text-xs sm:text-sm">
              {new Date(post.date).toLocaleDateString(LOCALE_TAGS[locale], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="text-[var(--border-secondary)]">·</span>
            <span className="text-xs sm:text-sm">{t.post.readingTime(post.readingMinutes)}</span>
            <span className="text-[var(--border-secondary)]">·</span>
            <ViewCounter slug={slug} className="text-xs sm:text-sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4 sm:mt-6 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs sm:text-sm text-[var(--text-muted)]"
                >
                  #{tagLabel(tag, locale)}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 번역본이 아직 없어 원문을 그대로 보여주는 경우 */}
        {post.isFallback && t.post.untranslatedNotice && (
          <p
            lang={LOCALE_TAGS[locale]}
            className="mt-6 sm:mt-8 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]"
          >
            {t.post.untranslatedNotice}
          </p>
        )}

        {/* Series Navigation (상단 - 목차만) */}
        {seriesNav && (
          <div className="pt-8 sm:pt-10">
            <SeriesNav
              series={seriesNav.series}
              posts={seriesNav.posts}
              currentIndex={seriesNav.currentIndex}
              locale={locale}
            />
          </div>
        )}

        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="pt-8 sm:pt-10">
            <TableOfContents items={toc} />
          </div>
        )}

        {/* Post Content */}
        <div className="py-8 sm:py-12 text-base sm:text-lg" lang={LOCALE_TAGS[post.contentLocale]}>
          <MDXContent source={post.content} />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Suspense fallback={null}>
            <RelatedPostsWithContext posts={relatedPosts} count={3} />
          </Suspense>
        )}

        {/* Series Navigation (하단 - 이전/다음) */}
        {seriesNav && (seriesNav.prev || seriesNav.next) && (
          <div className="py-6 border-t border-[var(--border-primary)]">
            <div className="flex justify-between gap-4">
              {seriesNav.prev ? (
                <Link
                  href={localizePath(locale, `/posts/${seriesNav.prev.slug}`)}
                  className="flex-1 group p-3 sm:p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:border-[var(--accent-primary)] transition-colors"
                >
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t.post.prevPost}
                  </span>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] mt-1 line-clamp-1">
                    {seriesNav.prev.title}
                  </p>
                </Link>
              ) : <div className="flex-1" />}

              {seriesNav.next ? (
                <Link
                  href={localizePath(locale, `/posts/${seriesNav.next.slug}`)}
                  className="flex-1 group p-3 sm:p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:border-[var(--accent-primary)] transition-colors text-right"
                >
                  <span className="text-xs text-[var(--text-muted)] flex items-center justify-end gap-1">
                    {t.post.nextPost}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] mt-1 line-clamp-1">
                    {seriesNav.next.title}
                  </p>
                </Link>
              ) : <div className="flex-1" />}
            </div>
          </div>
        )}

        {/* Comments */}
        <Comments />

        {/* Footer */}
        <footer className="py-8 sm:py-12 border-t border-[var(--border-primary)]">
          <Link
            href={localizePath(locale, '/')}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.post.backToAll}
          </Link>
        </footer>
      </article>
      </div>
    </>
  );
}
