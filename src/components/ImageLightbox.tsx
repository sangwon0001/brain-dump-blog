'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  maxWidth?: string;
}

export default function ImageLightbox({ src, alt, maxWidth }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      <span
        className="block relative my-6 sm:my-10 cursor-zoom-in"
        style={{ maxWidth: maxWidth || '100%', margin: maxWidth ? '1.5rem auto 1.5rem auto' : undefined }}
      >
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg sm:rounded-xl w-full h-auto shadow-[var(--shadow-md)]"
          style={{ width: '100%', height: 'auto' }}
          onClick={() => setOpen(true)}
        />
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={close}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={src}
              alt={alt}
              width={0}
              height={0}
              sizes="90vw"
              className="rounded-lg max-h-[90vh] w-auto h-auto object-contain"
              style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
