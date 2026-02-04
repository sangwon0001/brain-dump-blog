'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostMeta } from '@/lib/mdx';
import { cardEntrance, springs } from '@/lib/animations';

interface PostCardProps {
  post: PostMeta;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      variants={cardEntrance}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      custom={index}
      whileHover={{
        y: -4,
        transition: springs.bouncy,
      }}
      className="border border-[var(--border-primary)] rounded-lg p-4 sm:p-6 hover:shadow-[var(--shadow-md)] transition-shadow bg-[var(--bg-primary)]"
    >
      <Link href={`/${post.category}/${post.slug}`}>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[var(--text-muted)] mb-2 sm:mb-3">
          {post.draft && (
            <span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
              DRAFT
            </span>
          )}
          <span className="bg-[var(--category-bg)] text-[var(--category-text)] px-2 py-0.5 sm:py-1 rounded text-xs">
            {post.category}
          </span>
          <span className="hidden sm:inline text-[var(--border-primary)]">·</span>
          <time dateTime={post.date} className="text-xs sm:text-sm">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <span className="text-[var(--border-primary)]">·</span>
          <span className="text-xs sm:text-sm">{post.readingTime}</span>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2 text-[var(--text-primary)] leading-snug hover:text-[var(--accent-primary)] transition-colors">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[var(--tag-bg)] text-[var(--tag-text)] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-[var(--text-muted)]">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.article>
  );
}
