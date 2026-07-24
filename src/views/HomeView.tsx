import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';
import { NAV_TAGS, tagLabel } from '@/config/tags';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import { PopularPosts } from '@/components/PopularPosts';
import { WebsiteJsonLd } from '@/components/JsonLd';
import { getDictionary } from '@/i18n';
import { localizePath, type Locale } from '@/i18n/config';
import { absoluteUrl } from './metadata';

interface HomeViewProps {
  locale: Locale;
}

export default function HomeView({ locale }: HomeViewProps) {
  const t = getDictionary(locale);
  const allPosts = getAllPosts(locale);
  const recentPosts = allPosts.slice(0, 10);

  // Create postTitles map for PopularPosts
  const postTitles = Object.fromEntries(
    allPosts.map(post => [post.slug, { title: post.title }])
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <WebsiteJsonLd
        name={t.site.name}
        description={t.site.description}
        url={absoluteUrl(locale, '/')}
        locale={locale}
      />
      <Header navTags={[...NAV_TAGS]} posts={allPosts} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <section className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            {t.home.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4">
            {t.home.heroSubtitle}
          </p>
          <div className="text-xs sm:text-sm text-[var(--text-tertiary)] border-l-2 border-[var(--accent-primary)] pl-3">
            <p>{t.home.heroMeta}</p>
          </div>
        </section>

        {/* Tags */}
        <nav className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:gap-3 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
            <li>
              <Link
                href={localizePath(locale, '/')}
                className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[var(--accent-primary)] text-white"
              >
                {t.home.allTag}
              </Link>
            </li>
            {NAV_TAGS.map((tag) => (
              <li key={tag}>
                <Link
                  href={localizePath(locale, `/tags/${encodeURIComponent(tag)}`)}
                  className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] transition-colors whitespace-nowrap"
                >
                  {tagLabel(tag, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Popular Posts */}
        <section className="mb-8 sm:mb-12">
          <PopularPosts
            limit={5}
            showPeriodSelector={true}
            postTitles={postTitles}
            className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 sm:p-6"
          />
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[var(--text-primary)]">
            {t.home.recentPosts}
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {recentPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
