import Link from 'next/link';
import { getAllTags, getPostsByTag, getAllPosts } from '@/lib/mdx';
import { NAV_TAGS } from '@/config/navigation';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.sangwon0001.xyz";

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const description = `"${decodedTag}" 태그가 포함된 글 목록`;
  const url = `${SITE_URL}/tags/${tag}`;

  return {
    title: `#${decodedTag}`,
    description,
    openGraph: {
      type: "website",
      url,
      title: `#${decodedTag} | 뇌 용량 확보용`,
      description,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const allPosts = getAllPosts();
  const allTags = getAllTags();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header navTags={[...NAV_TAGS]} currentTag={decodedTag} posts={allPosts} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Tag Header */}
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-1 sm:mb-2">
            <Link
              href="/tags"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              ← 모든 태그
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">
            #{decodedTag}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {posts.length}개의 글
          </p>
        </section>

        {/* Other Tags */}
        <nav className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:gap-3 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
            {allTags.slice(0, 10).map(({ tag: t }) => (
              <li key={t}>
                <Link
                  href={`/tags/${encodeURIComponent(t)}`}
                  className={`inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    t === decodedTag
                      ? 'bg-[var(--accent-primary)] text-white font-medium'
                      : 'text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)]'
                  }`}
                >
                  #{t}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tags"
                className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] transition-colors"
              >
                더보기...
              </Link>
            </li>
          </ul>
        </nav>

        {/* Posts */}
        <div className="grid gap-4 sm:gap-6">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
