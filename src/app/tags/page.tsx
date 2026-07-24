import TagsView from '@/views/TagsView';
import { buildTagsMetadata } from '@/views/metadata';

const LOCALE = 'ko' as const;

export const metadata = buildTagsMetadata(LOCALE);

export default function TagsPage() {
  return <TagsView locale={LOCALE} />;
}
