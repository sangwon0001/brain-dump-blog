import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content');

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getFilesRecursively(fullPath));
    } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

export function getAllPosts(): PostMeta[] {
  const files = getFilesRecursively(contentDirectory);

  const posts = files.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const relativePath = path.relative(contentDirectory, filePath);
    const category = path.dirname(relativePath);
    const slug = path.basename(relativePath, path.extname(relativePath));

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      category: category === '.' ? 'uncategorized' : category,
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      readingTime: readingTime(content).text,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category))];
  return categories.sort();
}

export function getPostBySlug(category: string, slug: string): Post | null {
  const filePath = path.join(contentDirectory, category, `${slug}.md`);
  const mdxPath = path.join(contentDirectory, category, `${slug}.mdx`);

  let actualPath = '';
  if (fs.existsSync(filePath)) {
    actualPath = filePath;
  } else if (fs.existsSync(mdxPath)) {
    actualPath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(actualPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    category,
    tags: data.tags || [],
    thumbnail: data.thumbnail,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getRecentPosts(count: number = 5): PostMeta[] {
  return getAllPosts().slice(0, count);
}
