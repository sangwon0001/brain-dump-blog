import Link from 'next/link';
import { getPostsByCategory, getCategories } from '@/lib/mdx';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  return {
    title: `${category} - My Blog`,
    description: `${category} 카테고리의 글 목록`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const categories = getCategories();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {category}
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {posts.length} posts
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
                className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
              >
                All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/${cat}`}
                  className={`text-sm sm:text-base whitespace-nowrap ${
                    cat === category
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Posts */}
        <div className="grid gap-4 sm:gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
