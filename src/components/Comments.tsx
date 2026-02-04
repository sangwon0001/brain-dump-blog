"use client";

import { useEffect, useRef } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.sangwon0001.xyz";
const THEME_LIGHT = `${SITE_URL}/giscus/theme-light.css`;
const THEME_DARK = `${SITE_URL}/giscus/theme-dark.css`;

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Giscus 설정
    script.setAttribute("data-repo", "sangwon0001/brain-dump-blog");
    script.setAttribute("data-repo-id", "R_kgDORISIeA");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDORISIeM4C132A");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");

    // 커스텀 테마 적용
    const isDark = document.documentElement.classList.contains("dark");
    script.setAttribute("data-theme", isDark ? THEME_DARK : THEME_LIGHT);

    ref.current.appendChild(script);
  }, []);

  // 테마 변경 감지
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          const iframe = document.querySelector<HTMLIFrameElement>(
            "iframe.giscus-frame"
          );
          if (iframe) {
            iframe.contentWindow?.postMessage(
              {
                giscus: {
                  setConfig: {
                    theme: isDark ? THEME_DARK : THEME_LIGHT,
                  },
                },
              },
              "https://giscus.app"
            );
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mt-12 pt-8 border-t border-[var(--border-primary)]">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
        댓글
      </h2>
      <div ref={ref} />
    </section>
  );
}
