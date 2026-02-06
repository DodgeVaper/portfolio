import type { MetadataRoute } from 'next';
import { reader } from '@/lib/keystatic';

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url) return 'http://localhost:3000';
  try {
    new URL(url);
    return url;
  } catch {
    return 'http://localhost:3000';
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = baseUrl();
  let posts: string[] = [];
  try {
    posts = await reader.collections.posts.list();
  } catch (error) {
    console.error('Failed to read posts for sitemap:', error);
  }
  const staticPages = ['', '/about', '/projects', '/music', '/blog', '/contact'];

  return [
    ...staticPages.map((p) => ({
      url: `${url}${p}`,
      lastModified: new Date(),
    })),
    ...posts.map((slug) => ({
      url: `${url}/blog/${slug}`,
      lastModified: new Date(),
    })),
  ];
}


