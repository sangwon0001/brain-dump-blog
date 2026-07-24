import { getAllTags } from '@/lib/mdx';
import TagView from '@/views/TagView';
import { buildTagMetadata } from '@/views/metadata';

const LOCALE = 'en' as const;

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags(LOCALE).map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  return buildTagMetadata(LOCALE, decodeURIComponent(tag));
}

export default async function EnTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  return <TagView locale={LOCALE} decodedTag={decodeURIComponent(tag)} />;
}
