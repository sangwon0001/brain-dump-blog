import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '뇌 용량 확보용';
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
            뇌
          </div>
          <span
            style={{
              color: '#9ca3af',
              fontSize: '24px',
            }}
          >
            뇌 용량 확보용
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
