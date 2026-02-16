'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';
import { PostMeta } from '@/lib/mdx';
import { backdropFade, slideFromRight } from '@/lib/animations';

const MASCOT_STORAGE_KEY = "mascot-visible";

interface HeaderProps {
  navTags?: string[];
  currentTag?: string;
  posts?: PostMeta[];
}

export default function Header({ navTags = [], currentTag, posts = [] }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMascotVisible, setIsMascotVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    // Load mascot visibility from localStorage
    const stored = localStorage.getItem(MASCOT_STORAGE_KEY);
    if (stored !== null) {
      setIsMascotVisible(stored === "true");
    }

    // Listen for mascot toggle changes
    const handleMascotToggle = () => {
      setIsMascotVisible(prev => !prev);
    };
    window.addEventListener("toggle-mascot", handleMascotToggle);

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener("toggle-mascot", handleMascotToggle);
    };
  }, []);

  const toggleMascot = () => {
    window.dispatchEvent(new CustomEvent("toggle-mascot"));
  };

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
            {navTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className={`text-sm transition-colors ${tag === currentTag
                  ? 'text-[var(--accent-primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {tag}
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

            {/* GitHub link */}
            <a
              href="https://github.com/sangwon0001/brain-dump-blog"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="GitHub"
              title="GitHub"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>

            {/* Mascot toggle */}
            <button
              onClick={toggleMascot}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label={isMascotVisible ? "마스코트 숨기기" : "마스코트 보이기"}
              title={isMascotVisible ? "마스코트 숨기기" : "마스코트 보이기"}
            >
              <MascotIcon className="w-5 h-5" isVisible={isMascotVisible} />
            </button>

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
              className="fixed inset-0 z-[70] bg-black/50 sm:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              variants={slideFromRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed top-0 right-0 z-[80] h-full w-64 bg-[var(--bg-primary)] shadow-xl sm:hidden"
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
                  {navTags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/tags/${encodeURIComponent(tag)}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`block px-3 py-2 rounded-lg transition-colors ${tag === currentTag
                          ? 'bg-[var(--accent-bg)] text-[var(--accent-primary)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Mascot toggle in drawer */}
                <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                  <button
                    onClick={toggleMascot}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <MascotIcon className="w-5 h-5" isVisible={isMascotVisible} />
                    <span>{isMascotVisible ? "마스코트 숨기기" : "마스코트 보이기"}</span>
                  </button>
                  <a
                    href="https://github.com/sangwon0001/brain-dump-blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <GitHubIcon className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                </div>
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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function MascotIcon({ className, isVisible }: { className?: string; isVisible: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" style={{ opacity: isVisible ? 1 : 0.4 }}>
      <ellipse cx="12" cy="11" rx="8" ry="7" fill="var(--mascot-body)" />
      <path d="M6 8 Q9 6 12 8 Q15 6 18 8" stroke="var(--mascot-fold)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M5 11 Q9 9 12 11 Q15 9 19 11" stroke="var(--mascot-fold)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M6 14 Q9 12 12 14 Q15 12 18 14" stroke="var(--mascot-fold)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="9" cy="10" r="1.5" fill="white" />
      <circle cx="9" cy="10" r="0.8" fill="var(--mascot-pupil)" />
      <circle cx="15" cy="10" r="1.5" fill="white" />
      <circle cx="15" cy="10" r="0.8" fill="var(--mascot-pupil)" />
      <path d="M5 15 Q3 18 4 20" stroke="var(--mascot-fold)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M19 15 Q21 18 20 20" stroke="var(--mascot-fold)" strokeWidth="1" strokeLinecap="round" fill="none" />
      {!isVisible && (
        <line x1="4" y1="20" x2="20" y2="4" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
