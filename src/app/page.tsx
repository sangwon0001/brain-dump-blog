import Link from 'next/link';
import { getRecentPosts, getCategories, getAllPosts } from '@/lib/mdx';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import { PopularPosts } from '@/components/PopularPosts';

export default function Home() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 10);
  const categories = getCategories();

  // Create postTitles map for PopularPosts
  const postTitles = Object.fromEntries(
    allPosts.map(post => [post.slug, { title: post.title, category: post.category }])
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header categories={categories} posts={allPosts} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <section className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
            🧠 스상워이의 뇌 가비지 컬렉터
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-4">
            머릿속 비우고 RAM 확보하기 위해 만든 99%의 AI와 1%의 스상워이로 만들어진
          </p>
          <div className="text-xs sm:text-sm text-[var(--text-tertiary)] border-l-2 border-[var(--accent-primary)] pl-3">
            <p>개발자 · 풀스택(인 듯) · 블록체인 · AI(사용)</p>
          </div>
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
            최근 덤프
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
