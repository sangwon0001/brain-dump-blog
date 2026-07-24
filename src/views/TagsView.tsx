import Link from 'next/link';
import { getAllTags, getAllPosts } from '@/lib/mdx';
import { NAV_TAGS, tagLabel } from '@/config/tags';
import Header from '@/components/Header';
import { getDictionary } from '@/i18n';
import { localizePath, type Locale } from '@/i18n/config';

interface TagsViewProps {
  locale: Locale;
}

export default function TagsView({ locale }: TagsViewProps) {
  const t = getDictionary(locale);
  const tags = getAllTags(locale);
  const allPosts = getAllPosts(locale);

  // 태그 크기 계산 (최소 1, 최대 개수 기준)
  const counts = tags.map(({ count }) => count);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  const getTagSize = (count: number) => {
    if (maxCount === minCount) return 'text-base';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) return 'text-xl font-semibold';
    if (ratio > 0.4) return 'text-lg font-medium';
    return 'text-base';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header navTags={[...NAV_TAGS]} posts={allPosts} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page Header */}
        <section className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">
            {t.tags.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {t.tags.tagCount(tags.length)}
          </p>
        </section>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={localizePath(locale, `/tags/${encodeURIComponent(tag)}`)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-primary)] transition-colors ${getTagSize(count)}`}
            >
              <span>{tagLabel(tag, locale)}</span>
              <span className="text-xs opacity-70">({count})</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
