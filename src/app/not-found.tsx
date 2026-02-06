'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
function MascotSvg({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      style={{ width: size, height: size, ...style }}
    >
      {/* Tentacles */}
      <path d="M15 55 Q5 65 8 72" stroke="var(--mascot-fold)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M25 60 Q20 72 25 78" stroke="var(--mascot-fold)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M55 60 Q60 72 55 78" stroke="var(--mascot-fold)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M65 55 Q75 65 72 72" stroke="var(--mascot-fold)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Brain body */}
      <ellipse cx="40" cy="35" rx="28" ry="25" fill="var(--mascot-body)" />
      {/* Brain folds */}
      <path d="M20 25 Q30 20 40 25 Q50 20 60 25" stroke="var(--mascot-fold)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M18 35 Q28 30 40 35 Q52 30 62 35" stroke="var(--mascot-fold)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M22 45 Q32 40 40 45 Q48 40 58 45" stroke="var(--mascot-fold)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <ellipse cx="30" cy="32" rx="8" ry="9" fill="white" />
      <circle cx="30" cy="32" r="4" fill="var(--mascot-pupil)" />
      <circle cx="28" cy="30" r="1.5" fill="white" />
      <ellipse cx="50" cy="32" rx="8" ry="9" fill="white" />
      <circle cx="50" cy="32" r="4" fill="var(--mascot-pupil)" />
      <circle cx="48" cy="30" r="1.5" fill="white" />
      {/* Blush */}
      <ellipse cx="20" cy="40" rx="5" ry="3" fill="var(--mascot-blush)" opacity="0.5" />
      <ellipse cx="60" cy="40" rx="5" ry="3" fill="var(--mascot-blush)" opacity="0.5" />
      {/* Smile */}
      <path d="M35 48 Q40 53 45 48" stroke="var(--mascot-pupil)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

interface MascotData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  const mascots = useMemo<MascotData[]>(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: rand() * 80 + 5,
      y: rand() * 60 + 10,
      size: rand() * 40 + 50,
      duration: rand() * 4 + 3,
      delay: rand() * -5,
      dx: (rand() - 0.5) * 120,
      dy: (rand() - 0.5) * 80,
    }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating Mascots */}
      {mascots.map((m) => (
        <div
          key={m.id}
          className="not-found-mascot"
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            '--dx': `${m.dx}px`,
            '--dy': `${m.dy}px`,
          } as React.CSSProperties}
        >
          <MascotSvg size={m.size} style={{ opacity: 0.2 }} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl sm:text-8xl font-bold text-[var(--text-primary)] mb-2">
          404
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8">
          페이지를 찾을 수 없습니다
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg font-medium hover:bg-[var(--accent-primary-hover)] transition-colors"
        >
          홈으로 가기
        </Link>

        <p className="mt-6 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-mono font-bold text-base mr-1">
            {countdown}
          </span>
          초 후 자동으로 홈으로 이동합니다
        </p>
      </div>

      <style>{`
        @keyframes mascot-float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(var(--dx), var(--dy)) rotate(10deg);
          }
          50% {
            transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 0.7)) rotate(-5deg);
          }
          75% {
            transform: translate(calc(var(--dx) * 0.3), calc(var(--dy) * -0.8)) rotate(8deg);
          }
        }
        .not-found-mascot {
          animation: mascot-float var(--duration, 5s) ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
