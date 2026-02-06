import type { MetadataRoute } from 'next';
import { reader } from '@/lib/keystatic';

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = baseUrl();
  const posts = await reader.collections.posts.list();
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


