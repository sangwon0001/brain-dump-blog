import type ko from './ko';

const en: typeof ko = {
  site: {
    name: 'Brain Garbage Collector',
    description:
      'A blog for flushing my head and freeing up RAM. Dev, AI, and a dumping ground for stray thoughts.',
    rssTitle: "Sangwon's Brain Garbage Collector",
    rssDescription: 'A blog built to flush my head and free up some RAM',
    authorName: 'Sangwon Seo',
  },
  header: {
    logo: 'Just a Blog',
    home: 'Home',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    search: 'Search',
    showMascot: 'Show mascot',
    hideMascot: 'Hide mascot',
    switchLanguage: 'Switch language',
  },
  home: {
    heroTitle: "🧠 Sangwon's Brain Garbage Collector",
    heroSubtitle: 'Built to flush my head and free up RAM — 99% AI, 1% me.',
    heroMeta: 'Developer · Full-stack (apparently) · Blockchain · AI (as a user)',
    allTag: 'All',
    recentPosts: 'Recent dumps',
  },
  search: {
    placeholder: 'Type to search...',
    noResults: 'No results found',
    hintMove: '↑↓ navigate',
    hintSelect: '↵ select',
    hintClose: 'esc close',
  },
  popular: {
    title: 'Popular posts',
    loading: 'Loading...',
    empty: 'No data yet',
    periods: {
      daily: 'Today',
      weekly: 'This week',
      monthly: 'This month',
      total: 'All time',
    },
  },
  post: {
    seriesTitle: (series: string) => `${series} series`,
    seriesCount: (count: number) => `(${count} parts)`,
    tableOfContents: 'Table of contents',
    relatedPosts: 'Related posts',
    comments: 'Comments',
    prevPost: 'Previous',
    nextPost: 'Next',
    backToAll: 'Back to all posts',
    views: (count: string) => `${count} views`,
    readingTime: (minutes: number) => `${minutes} min read`,
    untranslatedNotice:
      'An English translation of this post is not ready yet. The Korean original is shown below.',
  },
  tags: {
    title: 'Tags',
    description: 'All tags',
    tagCount: (count: number) => `${count} tags`,
    postCount: (count: number) => (count === 1 ? '1 post' : `${count} posts`),
    allTags: 'All tags',
    more: 'More...',
    taggedWith: (tag: string) => `Posts tagged with "${tag}"`,
  },
  notFound: {
    message: "This page doesn't exist",
    goHome: 'Go home',
    countdownSuffix: 'seconds until you are sent home',
  },
  a11y: {
    backToTop: 'Back to top',
    toLightMode: 'Switch to light mode',
    toDarkMode: 'Switch to dark mode',
    mascot: 'Blog mascot',
  },
  giscusLang: 'en',
};

export default en;
