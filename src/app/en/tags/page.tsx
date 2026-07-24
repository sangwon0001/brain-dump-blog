import TagsView from '@/views/TagsView';
import { buildTagsMetadata } from '@/views/metadata';

const LOCALE = 'en' as const;

export const metadata = buildTagsMetadata(LOCALE);

export default function EnTagsPage() {
  return <TagsView locale={LOCALE} />;
}
