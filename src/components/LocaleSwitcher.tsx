'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT_LABELS, switchLocalePath } from '@/i18n/config';
import { useDictionary, useLocale } from '@/i18n/client';

interface LocaleSwitcherProps {
  /** 모바일 드로어처럼 넓은 영역에 놓을 때는 라벨을 길게 쓴다 */
  variant?: 'compact' | 'full';
  onNavigate?: () => void;
}

export default function LocaleSwitcher({ variant = 'compact', onNavigate }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? '/';
  const current = useLocale();
  const t = useDictionary();

  return (
    <div
      className={
        variant === 'compact'
          ? 'flex items-center rounded-lg border border-[var(--border-primary)] overflow-hidden'
          : 'flex items-center gap-2'
      }
      role="group"
      aria-label={t.header.switchLanguage}
    >
      {LOCALES.map((locale) => {
        const isActive = locale === current;
        const label = variant === 'compact' ? LOCALE_SHORT_LABELS[locale] : LOCALE_LABELS[locale];

        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            onClick={onNavigate}
            aria-current={isActive ? 'true' : undefined}
            className={
              variant === 'compact'
                ? `px-2 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`
                : `px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-bg)] text-[var(--accent-primary)] font-medium'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
