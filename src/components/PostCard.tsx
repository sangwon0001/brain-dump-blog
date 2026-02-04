import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <Link href={`/${post.category}/${post.slug}`}>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {post.category}
          </span>
          <span>·</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
          {post.description}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
