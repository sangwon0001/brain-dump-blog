'use client';

import { useSearchParams } from 'next/navigation';
import { PostMeta } from '@/lib/mdx';
import RelatedPosts from './RelatedPosts';

interface RelatedPostsWithContextProps {
  posts: PostMeta[];
  count?: number;
}

export default function RelatedPostsWithContext({ posts, count = 3 }: RelatedPostsWithContextProps) {
  const searchParams = useSearchParams();
  const fromTag = searchParams.get('from');

  if (posts.length === 0) return null;

  let sorted = posts;
  if (fromTag) {
    sorted = [...posts].sort((a, b) => {
      const aHas = (a.tags as string[] | undefined)?.includes(fromTag) ? 1 : 0;
      const bHas = (b.tags as string[] | undefined)?.includes(fromTag) ? 1 : 0;
      return bHas - aHas;
    });
  }

  return <RelatedPosts posts={sorted.slice(0, count)} />;
}
