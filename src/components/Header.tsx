'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  categories?: string[];
  currentCategory?: string;
}

export default function Header({ categories = [], currentCategory }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            My Blog
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`text-sm transition-colors ${
                  cat === currentCategory
                    ? 'text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="메뉴 열기"
            >
              <MenuIcon className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 sm:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 z-50 h-full w-64 bg-[var(--bg-primary)] shadow-xl sm:hidden animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
              <span className="font-semibold text-[var(--text-primary)]">메뉴</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                aria-label="메뉴 닫기"
              >
                <CloseIcon className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsDrawerOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    홈
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/${cat}`}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        cat === currentCategory
                          ? 'bg-[var(--accent-bg)] text-[var(--accent-primary)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
