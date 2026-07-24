import { getAllPosts } from '@/lib/mdx';
import PostView from '@/views/PostView';
import { buildPostMetadata } from '@/views/metadata';

const LOCALE = 'en' as const;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts(LOCALE).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  return buildPostMetadata(LOCALE, slug);
}

export default async function EnPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  return <PostView locale={LOCALE} slug={slug} />;
}
