import Link from 'next/link';
import { getRecentPosts, getCategories } from '@/lib/mdx';
import PostCard from '@/components/PostCard';

export default function Home() {
  const recentPosts = getRecentPosts(10);
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Blog
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Tech, AI, and more
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Categories */}
        <nav className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-3 sm:gap-4 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
            <li>
              <Link
                href="/"
                className="text-sm sm:text-base text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap"
              >
                All
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/${category}`}
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Recent Posts */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
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
