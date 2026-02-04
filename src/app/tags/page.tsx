import Link from 'next/link';
import { getAllTags, getCategories, getAllPosts } from '@/lib/mdx';
import Header from '@/components/Header';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.sangwon0001.xyz";

export const metadata = {
  title: "태그",
  description: "모든 태그 목록",
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tags`,
    title: "태그 | 뇌 용량 확보용",
    description: "모든 태그 목록",
  },
};

export default function TagsPage() {
  const tags = getAllTags();
  const categories = getCategories();
  const allPosts = getAllPosts();

  // 태그 크기 계산 (최소 1, 최대 개수 기준)
  const maxCount = Math.max(...tags.map((t) => t.count));
  const minCount = Math.min(...tags.map((t) => t.count));

  const getTagSize = (count: number) => {
    if (maxCount === minCount) return 'text-base';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) return 'text-xl font-semibold';
    if (ratio > 0.4) return 'text-lg font-medium';
    return 'text-base';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header categories={categories} posts={allPosts} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page Header */}
        <section className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">
            태그
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {tags.length}개의 태그
          </p>
        </section>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-primary)] transition-colors ${getTagSize(count)}`}
            >
              <span>{tag}</span>
              <span className="text-xs opacity-70">({count})</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
