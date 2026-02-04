import Link from 'next/link';
import { getRecentPosts, getCategories } from '@/lib/mdx';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';

export default function Home() {
  const recentPosts = getRecentPosts(10);
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header categories={categories} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <section className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Welcome to My Blog
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Tech, AI, and more
          </p>
        </section>

        {/* Categories */}
        <nav className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:gap-3 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
            <li>
              <Link
                href="/"
                className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-[var(--accent-primary)] text-white"
              >
                All
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/${category}`}
                  className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] transition-colors whitespace-nowrap"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Recent Posts */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[var(--text-primary)]">
            Recent Posts
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {recentPosts.map((post) => (
              <PostCard key={`${post.category}/${post.slug}`} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
