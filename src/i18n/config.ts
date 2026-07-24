export const LOCALES = ['ko', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * 기본 로케일은 URL 프리픽스를 갖지 않는다.
 * 기존 한국어 URL(`/posts/foo`)을 그대로 유지하기 위한 선택.
 * 나머지 로케일은 `/en/posts/foo` 처럼 프리픽스를 붙인다.
 */
export const DEFAULT_LOCALE: Locale = 'ko';

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

/** 언어 전환 버튼에 노출되는 짧은 라벨 */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
};

/** `Intl` 및 `hreflang`에 쓰는 BCP 47 태그 */
export const LOCALE_TAGS: Record<Locale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
};

/** OpenGraph `og:locale` 값 */
export const OG_LOCALES: Record<Locale, string> = {
  ko: 'ko_KR',
  en: 'en_US',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * 로케일 프리픽스를 붙인 경로를 만든다.
 * `localizePath('en', '/posts/foo')` → `/en/posts/foo`
 * `localizePath('ko', '/posts/foo')` → `/posts/foo`
 */
export function localizePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

/** 경로에서 로케일을 판별한다. 프리픽스가 없으면 기본 로케일. */
export function localeFromPathname(pathname: string): Locale {
  const [, first] = pathname.split('/');
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    return first;
  }
  return DEFAULT_LOCALE;
}

/** 경로에서 로케일 프리픽스를 떼어낸 "중립 경로"를 돌려준다. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPathname(pathname);
  if (locale === DEFAULT_LOCALE) return pathname || '/';
  const stripped = pathname.slice(`/${locale}`.length);
  return stripped === '' ? '/' : stripped;
}

/** 현재 경로를 유지한 채 다른 로케일 경로로 바꾼다. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizePath(target, stripLocale(pathname));
}
