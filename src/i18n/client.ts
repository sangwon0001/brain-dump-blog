'use client';

import { usePathname } from 'next/navigation';
import { getDictionary, type Dictionary } from './index';
import { localeFromPathname, type Locale } from './config';

/**
 * 현재 URL에서 로케일을 읽는다.
 *
 * 클라이언트 컴포넌트는 루트 레이아웃부터 prop을 내려받지 않아도 되도록
 * 경로 기반으로 로케일을 판별한다. `/en/...` 이면 en, 아니면 ko.
 */
export function useLocale(): Locale {
  const pathname = usePathname();
  return localeFromPathname(pathname ?? '/');
}

export function useDictionary(): Dictionary {
  return getDictionary(useLocale());
}
