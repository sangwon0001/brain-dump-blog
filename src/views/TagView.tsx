import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag, getAllPosts } from '@/lib/mdx';
import { NAV_TAGS, tagLabel } from '@/config/tags';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import { getDictionary } from '@/i18n';
import { localizePath, type Locale } from '@/i18n/config';

interface TagViewProps {
  locale: Locale;
  decodedTag: string;
}

export default function TagView({ locale, decodedTag }: TagViewProps) {
  const t = getDictionary(locale);
  const posts = getPostsByTag(decodedTag, locale);
  const allPosts = getAllPosts(locale);
  const allTags = getAllTags(locale);

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
              href={localizePath(locale, '/tags')}
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              ← {t.tags.allTags}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">
            #{tagLabel(decodedTag, locale)}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {t.tags.postCount(posts.length)}
          </p>
        </section>

        {/* Other Tags */}
        <nav className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:gap-3 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
            {allTags.slice(0, 10).map(({ tag }) => (
              <li key={tag}>
                <Link
                  href={localizePath(locale, `/tags/${encodeURIComponent(tag)}`)}
                  className={`inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    tag === decodedTag
                      ? 'bg-[var(--accent-primary)] text-white font-medium'
                      : 'text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)]'
                  }`}
                >
                  #{tagLabel(tag, locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={localizePath(locale, '/tags')}
                className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] transition-colors"
              >
                {t.tags.more}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Posts */}
        <div className="grid gap-4 sm:gap-6">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} fromTag={decodedTag} />
          ))}
        </div>
      </main>
    </div>
  );
}
