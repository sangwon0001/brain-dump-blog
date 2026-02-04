import Link from 'next/link';
import { getRecentPosts, getCategories } from '@/lib/mdx';
import PostCard from '@/components/PostCard';

export default function Home() {
  const recentPosts = getRecentPosts(10);
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Blog
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tech, AI, and more
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Categories */}
        <nav className="mb-8">
          <ul className="flex gap-4 flex-wrap">
            <li>
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                All
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/${category}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Recent Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Recent Posts
          </h2>
          <div className="grid gap-6">
            {recentPosts.map((post) => (
              <PostCard key={`${post.category}/${post.slug}`} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
