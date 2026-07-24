'use client';

import { useEffect } from 'react';
import { LOCALE_TAGS, type Locale } from '@/i18n/config';

/**
 * 루트 `<html>`의 `lang`을 현재 로케일로 맞춘다.
 *
 * App Router의 루트 레이아웃은 하나뿐이라 정적 생성 상태에서 로케일별 `lang`을
 * 서버에서 찍을 수 없다. 마크업상의 언어는 `/en` 레이아웃의 `<div lang>`이
 * 책임지고, 이 컴포넌트는 문서 최상단 속성만 브라우저에서 보정한다.
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = LOCALE_TAGS[locale];
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  return null;
}
