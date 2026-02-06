import { reader } from '@/lib/keystatic';
import { BlogList, type BlogItem } from '@/components/BlogList';

export default async function BlogPage() {
  const all = await reader.collections.posts.all();
  const posts: BlogItem[] = all
    .map((p) => ({
      slug: p.slug,
      title: p.entry.title,
      date: p.entry.date,
      tags: p.entry.tags ?? [],
      excerpt: p.entry.excerpt,
    }))
    .sort((a, b) => +new Date(b.date ?? 0) - +new Date(a.date ?? 0));

  return (
    <div className="container-pad py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-4 text-muted">Лента постов с фильтром по тегам. Посты редактируются в /keystatic.</p>
      </div>

      <div className="mt-10">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}


