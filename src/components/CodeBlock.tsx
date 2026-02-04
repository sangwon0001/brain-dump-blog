'use client';

import { useState, useRef } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
}

export default function CodeBlock({ children, language = 'code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLDivElement>(null);
  
  const handleCopy = async () => {
    const code = preRef.current?.textContent || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 sm:my-6 rounded-lg overflow-hidden border border-[var(--code-border)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[var(--code-header-bg)] text-[var(--text-muted)] px-3 sm:px-4 py-2 text-xs sm:text-sm border-b border-[var(--code-border)]">
        <span className="font-mono text-xs uppercase tracking-wide">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 sm:gap-1.5 hover:text-[var(--text-primary)] active:text-green-400 transition-colors text-xs touch-manipulation"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <div 
        ref={preRef} 
        className="overflow-x-auto bg-[var(--code-bg)] [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:p-3 sm:[&>pre]:p-4 [&>pre]:!bg-transparent text-xs sm:text-sm"
      >
        {children}
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
