import Link from 'next/link';
import { getPostsByCategory, getCategories } from '@/lib/mdx';
import PostCard from '@/components/PostCard';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({ category }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.sangwon0001.xyz";

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const description = `${category} 카테고리의 글 목록`;
  const url = `${SITE_URL}/${category}`;

  return {
    title: category,
    description,
    openGraph: {
      type: "website",
      url,
      title: `${category} | 뇌 용량 확보용`,
      description,
    },
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header categories={categories} currentCategory={category} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Category Header */}
        <section className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">
            {category}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {posts.length} posts
          </p>
        </section>

        {/* Categories */}
        <nav className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:gap-3 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
            <li>
              <Link
                href="/"
                className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)] transition-colors"
              >
                All
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/${cat}`}
                  className={`inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    cat === category
                      ? 'bg-[var(--accent-primary)] text-white font-medium'
                      : 'text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)]'
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
