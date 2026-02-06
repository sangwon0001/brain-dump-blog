import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';

interface RelatedPostsProps {
  posts: PostMeta[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="py-8 sm:py-10 border-t border-[var(--border-primary)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <span>🔗</span>
        관련 글
      </h3>

      <div className="grid gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg hover:border-[var(--accent-primary)] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-1">
                  {post.title}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-1">
                  {post.description}
                </p>
              </div>
              {post.tags && post.tags[0] && (
                <span className="flex-shrink-0 text-xs text-[var(--accent-primary)] bg-[var(--accent-bg)] px-2 py-1 rounded">
                  {post.tags[0]}
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-[var(--text-muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
