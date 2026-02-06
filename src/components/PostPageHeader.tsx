'use client';

import { useSearchParams } from 'next/navigation';
import Header from './Header';
import { NAV_TAGS } from '@/config/tags';
import { PostMeta } from '@/lib/mdx';

interface PostPageHeaderProps {
  posts: PostMeta[];
}

export default function PostPageHeader({ posts }: PostPageHeaderProps) {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('from') ?? undefined;

  return <Header navTags={[...NAV_TAGS]} currentTag={currentTag} posts={posts} />;
}
