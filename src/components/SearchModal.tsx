'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/mdx';

interface SearchModalProps {
  posts: PostMeta[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ posts, isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostMeta[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 검색 로직
  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(q);
      const descMatch = post.description.toLowerCase().includes(q);
      const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || tagMatch;
    });

    setResults(filtered.slice(0, 10));
    setSelectedIndex(0);
  }, [posts]);

  // 쿼리 변경 시 검색
  useEffect(() => {
    search(query);
  }, [query, search]);

  // 모달 열릴 때 포커스
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      window.location.href = `/${results[selectedIndex].category}/${results[selectedIndex].slug}`;
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // 선택된 항목 스크롤
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, results.length]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[15%] z-50 mx-auto max-w-xl">
        <div className="overflow-hidden rounded-xl bg-[var(--bg-primary)] shadow-2xl border border-[var(--border-primary)]">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 border-b border-[var(--border-primary)]">
            <SearchIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력하세요..."
              className="flex-1 py-4 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-[var(--text-secondary)]">
                검색 결과가 없습니다
              </div>
            )}

            {results.map((post, index) => (
              <Link
                key={`${post.category}/${post.slug}`}
                href={`/${post.category}/${post.slug}`}
                onClick={onClose}
                className={`block px-4 py-3 transition-colors ${
                  index === selectedIndex
                    ? 'bg-[var(--accent-bg)]'
                    : 'hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[var(--accent-primary)]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {post.date}
                  </span>
                </div>
                <h3 className="font-medium text-[var(--text-primary)] line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Footer */}
          {!query && (
            <div className="px-4 py-3 border-t border-[var(--border-primary)] text-xs text-[var(--text-tertiary)]">
              <span className="mr-4">↑↓ 이동</span>
              <span className="mr-4">↵ 선택</span>
              <span>esc 닫기</span>
            </div>
          )}
        </div>
      </div>
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
