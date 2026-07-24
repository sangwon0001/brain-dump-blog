import { buildFeedResponse } from '@/views/feed';

export async function GET() {
  return buildFeedResponse('en');
}
