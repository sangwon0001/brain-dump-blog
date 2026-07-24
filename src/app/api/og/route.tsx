import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';

export const runtime = 'edge';

/** 배지에 들어가는 한 글자 (로케일별 사이트명 머리글자) */
const BADGE_GLYPH = { ko: '뇌', en: 'B' } as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale') || '';
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const t = getDictionary(locale);

  const title = searchParams.get('title') || t.site.name;
  const category = searchParams.get('category') || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#0f0f0f',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f0f 50%, #16213e 100%)',
          }}
        />

        {/* Decorative element */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.3,
          }}
        />

        {/* Category badge */}
        {category && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 20px',
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
              borderRadius: '9999px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                color: '#a5b4fc',
                fontSize: '24px',
                fontWeight: 500,
              }}
            >
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 30 ? '52px' : '64px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.3,
            maxWidth: '90%',
            wordBreak: 'keep-all',
          }}
        >
          {title}
        </div>

        {/* Site name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '40px',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            {BADGE_GLYPH[locale]}
          </div>
          <span
            style={{
              color: '#9ca3af',
              fontSize: '24px',
            }}
          >
            {t.site.name}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
