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
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {category}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {posts.length} posts
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
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/${cat}`}
                  className={
                    cat === category
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Posts */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
