'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';
import { PostMeta } from '@/lib/mdx';
import { backdropFade, slideFromRight } from '@/lib/animations';

interface HeaderProps {
  categories?: string[];
  currentCategory?: string;
  posts?: PostMeta[];
}

export default function Header({ categories = [], currentCategory, posts = [] }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            블로그임
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${cat}`}
                className={`text-sm transition-colors ${cat === currentCategory
                  ? 'text-[var(--accent-primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="검색"
            >
              <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm">검색</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>

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

      {/* Search Modal */}
      <SearchModal
        posts={posts}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropFade}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 sm:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              variants={slideFromRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed top-0 right-0 z-50 h-full w-64 bg-[var(--bg-primary)] shadow-xl sm:hidden"
            >
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
                        className={`block px-3 py-2 rounded-lg transition-colors ${cat === currentCategory
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
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
