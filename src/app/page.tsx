import HomeView from '@/views/HomeView';
import { buildHomeMetadata } from '@/views/metadata';

const LOCALE = 'ko' as const;

export const metadata = buildHomeMetadata(LOCALE);

export default function Home() {
  return <HomeView locale={LOCALE} />;
}
