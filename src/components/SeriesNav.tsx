import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE, localizePath, type Locale } from '@/i18n/config';

interface SeriesNavProps {
  series: string;
  posts: PostMeta[];
  currentIndex: number;
  locale?: Locale;
}

export default function SeriesNav({
  series,
  posts,
  currentIndex,
  locale = DEFAULT_LOCALE,
}: SeriesNavProps) {
  const t = getDictionary(locale);

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 sm:p-6 mb-8 sm:mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📚</span>
        <h3 className="font-semibold text-[var(--text-primary)]">{t.post.seriesTitle(series)}</h3>
        <span className="text-sm text-[var(--text-muted)]">{t.post.seriesCount(posts.length)}</span>
      </div>

      <ol className="space-y-2">
        {posts.map((post, index) => {
          const isCurrent = index === currentIndex;
          return (
            <li key={post.slug} className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                isCurrent
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--border-primary)] text-[var(--text-muted)]'
              }`}>
                {index + 1}
              </span>
              {isCurrent ? (
                <span className="text-[var(--text-primary)] font-medium pt-0.5">
                  {post.title}
                </span>
              ) : (
                <Link
                  href={localizePath(locale, `/posts/${post.slug}`)}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors pt-0.5"
                >
                  {post.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
