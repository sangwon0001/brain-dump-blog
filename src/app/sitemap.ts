import { MetadataRoute } from "next";
import { getAllPosts, getAllTags, hasTranslation } from "@/lib/mdx";
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS, type Locale } from "@/i18n/config";
import { absoluteUrl } from "@/views/metadata";

/**
 * 로케일별 대체 URL(hreflang) 묶음.
 * `availableLocales`를 좁히면 번역본이 없는 언어는 광고하지 않는다.
 */
function alternates(path: string, availableLocales: readonly Locale[] = LOCALES) {
  const languages: Record<string, string> = {};
  availableLocales.forEach((locale) => {
    languages[LOCALE_TAGS[locale]] = absoluteUrl(locale, path);
  });
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  LOCALES.forEach((locale) => {
    entries.push({
      url: absoluteUrl(locale, "/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
      alternates: alternates("/"),
    });

    entries.push({
      url: absoluteUrl(locale, "/tags"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: alternates("/tags"),
    });

    getAllTags(locale).forEach(({ tag }) => {
      const path = `/tags/${encodeURIComponent(tag)}`;
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: alternates(path),
      });
    });

    getAllPosts(locale).forEach((post) => {
      // 번역본이 없어 원문으로 폴백된 글은 해당 로케일 URL을 색인시키지 않는다
      if (post.isFallback) return;

      const path = `/posts/${post.slug}`;
      const translated = LOCALES.filter((candidate) => hasTranslation(post.slug, candidate));

      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: alternates(path, translated),
      });
    });
  });

  return entries;
}
