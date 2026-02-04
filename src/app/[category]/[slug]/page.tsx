import Link from 'next/link';
import { getPostBySlug, getAllPosts, getCategories } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import MDXContent from '@/components/MDXContent';
import Header from '@/components/Header';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPostBySlug(category, slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: `${post.title} - My Blog`,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPostBySlug(category, slug);
  const categories = getCategories();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header categories={categories} currentCategory={post.category} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Post Header */}
        <header className="pt-8 sm:pt-12 pb-8 sm:pb-10 border-b border-[var(--border-primary)]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--text-muted)] mb-4 sm:mb-6">
            <Link
              href={`/${post.category}`}
              className="bg-[var(--accent-bg)] text-[var(--accent-primary)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
            >
              {post.category}
            </Link>
            <span className="text-[var(--border-secondary)]">·</span>
            <time dateTime={post.date} className="text-xs sm:text-sm">
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="text-[var(--border-secondary)]">·</span>
            <span className="text-xs sm:text-sm">{post.readingTime}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed">
            {post.description}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4 sm:mt-6 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs sm:text-sm text-[var(--text-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="py-8 sm:py-12 text-base sm:text-lg">
          <MDXContent source={post.content} />
        </div>
        
        {/* Footer */}
        <footer className="py-8 sm:py-12 border-t border-[var(--border-primary)]">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 sm:gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
