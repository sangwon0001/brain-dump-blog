import type { Metadata } from 'next';
import HtmlLang from '@/components/HtmlLang';
import { getDictionary } from '@/i18n';
import { LOCALE_TAGS } from '@/i18n/config';

const t = getDictionary('en');

/** `/en` 하위의 제목 템플릿을 영어 사이트명으로 덮어쓴다 */
export const metadata: Metadata = {
  title: {
    default: t.site.name,
    template: `%s | ${t.site.name}`,
  },
  description: t.site.description,
};

/**
 * `/en` 하위 전체를 영어로 표시한다.
 *
 * 루트 레이아웃의 `<html lang="ko">`는 하나뿐이라 여기서 두 겹으로 보정한다.
 * - `<div lang="en-US">`: 스크린리더/브라우저가 보는 실제 언어 (SSR HTML에 그대로 담긴다)
 * - `<HtmlLang>`: 브라우저에서 `document.documentElement.lang`까지 맞춰준다
 */
export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang={LOCALE_TAGS.en}>
      <HtmlLang locale="en" />
      {children}
    </div>
  );
}
