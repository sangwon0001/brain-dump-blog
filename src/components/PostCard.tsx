import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow active:scale-[0.99]">
      <Link href={`/${post.category}/${post.slug}`}>
        {/* Meta - stack on mobile */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 sm:py-1 rounded text-xs">
            {post.category}
          </span>
          <span className="hidden sm:inline">·</span>
          <time dateTime={post.date} className="text-xs sm:text-sm">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span className="text-xs sm:text-sm">{post.readingTime}</span>
        </div>
        
        {/* Title */}
        <h2 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900 dark:text-white leading-snug">
          {post.title}
        </h2>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {post.description}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}
