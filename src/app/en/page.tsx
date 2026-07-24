import HomeView from '@/views/HomeView';
import { buildHomeMetadata } from '@/views/metadata';

const LOCALE = 'en' as const;

export const metadata = buildHomeMetadata(LOCALE);

export default function EnHome() {
  return <HomeView locale={LOCALE} />;
}
