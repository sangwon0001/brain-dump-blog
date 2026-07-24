import ko from './dictionaries/ko';
import en from './dictionaries/en';
import type { Locale } from './config';

export type Dictionary = typeof ko;

const dictionaries: Record<Locale, Dictionary> = { ko, en };

/**
 * 로케일별 UI 사전.
 *
 * 사전 값 중 일부는 함수(`seriesTitle` 등)라서 서버 컴포넌트에서 클라이언트
 * 컴포넌트로 prop으로 넘길 수 없다. 서버 컴포넌트는 이 함수를,
 * 클라이언트 컴포넌트는 `useDictionary()`를 쓴다.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from './config';
