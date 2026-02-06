import { Suspense } from 'react';
import Link from 'next/link';
import { getPostBySlug, getAllPosts, getSeriesNavigation, getRelatedPosts, extractToc } from '@/lib/mdx';
import { NAV_TAGS } from '@/config/tags';
import { notFound } from 'next/navigation';
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

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.sangwon0001.xyz";

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  const url = `${SITE_URL}/posts/${slug}`;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.tags?.[0] || '')}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();

  if (!post) {
    notFound();
  }

  const seriesNav = getSeriesNavigation(post);
  const relatedPosts = getRelatedPosts(post, 6);
  const toc = extractToc(post.content);

  const url = `${SITE_URL}/posts/${slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedTime={post.date}
        url={url}
        tags={post.tags}
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
                href={`/tags/${encodeURIComponent(post.tags[0])}`}
                className="bg-[var(--accent-bg)] text-[var(--accent-primary)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
              >
                {post.tags[0]}
              </Link>
            )}
            <span className="text-[var(--border-secondary)]">·</span>
            <time dateTime={post.date} className="text-xs sm:text-sm">
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="text-[var(--border-secondary)]">·</span>
            <span className="text-xs sm:text-sm">{post.readingTime}</span>
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
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Series Navigation (상단 - 목차만) */}
        {seriesNav && (
          <div className="pt-8 sm:pt-10">
            <SeriesNav
              series={seriesNav.series}
              posts={seriesNav.posts}
              currentIndex={seriesNav.currentIndex}
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
        <div className="py-8 sm:py-12 text-base sm:text-lg">
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
                  href={`/posts/${seriesNav.prev.slug}`}
                  className="flex-1 group p-3 sm:p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:border-[var(--accent-primary)] transition-colors"
                >
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    이전 글
                  </span>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] mt-1 line-clamp-1">
                    {seriesNav.prev.title}
                  </p>
                </Link>
              ) : <div className="flex-1" />}

              {seriesNav.next ? (
                <Link
                  href={`/posts/${seriesNav.next.slug}`}
                  className="flex-1 group p-3 sm:p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:border-[var(--accent-primary)] transition-colors text-right"
                >
                  <span className="text-xs text-[var(--text-muted)] flex items-center justify-end gap-1">
                    다음 글
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
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </Link>
        </footer>
      </article>
      </div>
    </>
  );
}
