import { getDictionary } from '@/i18n';
import { DEFAULT_LOCALE, LOCALE_TAGS, type Locale } from '@/i18n/config';

interface ArticleJsonLdProps {
  title: string;
  description: string;
  publishedTime: string;
  url: string;
  tags?: string[];
  authorName?: string;
  locale?: Locale;
}

export function ArticleJsonLd({
  title,
  description,
  publishedTime,
  url,
  tags = [],
  locale = DEFAULT_LOCALE,
  authorName,
}: ArticleJsonLdProps) {
  const author = authorName ?? getDictionary(locale).site.authorName;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: publishedTime,
    dateModified: publishedTime,
    url: url,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: author,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: tags[0] || '',
    keywords: tags.join(', '),
    inLanguage: LOCALE_TAGS[locale],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  name: string;
  description: string;
  url: string;
  locale?: Locale;
}

export function WebsiteJsonLd({
  name,
  description,
  url,
  locale = DEFAULT_LOCALE,
}: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    description: description,
    url: url,
    inLanguage: LOCALE_TAGS[locale],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
