'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';

export type BlogItem = {
  slug: string;
  title: string;
  date: string | null;
  tags: readonly string[];
  excerpt?: string;
};

export function BlogList({ posts }: { posts: BlogItem[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [posts]);

  const [tag, setTag] = useState<string>('all');
  const filtered = useMemo(() => {
    if (tag === 'all') return posts;
    return posts.filter((p) => p.tags.includes(tag));
  }, [posts, tag]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTag('all')}
          className={'rounded-full px-4 py-2 text-sm transition ' + (tag === 'all' ? 'glass' : 'text-muted hover:glass')}
        >
          Все
        </button>
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={'rounded-full px-4 py-2 text-sm transition ' + (tag === t ? 'glass' : 'text-muted hover:glass')}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <GlassCard key={p.slug}>
            <div className="text-xs text-muted">
              {p.date ? new Date(p.date).toLocaleDateString('ru-RU') : '—'}
            </div>
            <div className="mt-2 font-mono text-lg">{p.title}</div>
            {p.excerpt ? <div className="mt-2 text-sm text-muted">{p.excerpt}</div> : null}
            {!!p.tags.length && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t, idx) => (
                  <span key={idx} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5">
              <Link href={`/blog/${p.slug}`} className="accent-code text-sm underline-offset-4 hover:underline">
                Читать →
              </Link>
            </div>
          </GlassCard>
        ))}

        {filtered.length === 0 && (
          <GlassCard className="md:col-span-2">
            <div className="text-muted">Нет постов по выбранному тегу.</div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}


