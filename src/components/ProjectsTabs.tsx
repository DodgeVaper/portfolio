'use client';

import { useMemo, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';

type Project = {
  slug: string;
  title: string;
  status: 'launched' | 'in_progress' | 'archive';
  description?: string;
  tags?: readonly string[];
  links?: { demo?: string | null; github?: string | null; case?: string | null };
};

const tabs: { label: string; value: Project['status'] }[] = [
  { label: 'Запущенные', value: 'launched' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Архив / Идеи', value: 'archive' },
];

export function ProjectsTabs({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<Project['status']>('launched');
  const filtered = useMemo(() => projects.filter((p) => p.status === tab), [projects, tab]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={
              'rounded-full px-4 py-2 text-sm transition ' +
              (tab === t.value ? 'glass text-[color:var(--fg)]' : 'text-muted hover:glass')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <GlassCard key={p.slug}>
            <div className="flex items-start justify-between gap-4">
              <div className="font-mono text-lg">{p.title}</div>
              <div className="text-xs text-muted">{p.status}</div>
            </div>
            {p.description && <div className="mt-2 text-sm text-muted">{p.description}</div>}
            {!!(p.tags?.length) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags!.map((tag, idx) => (
                  <span key={idx} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {p.links?.demo && (
                <a className="accent-code underline-offset-4 hover:underline" href={p.links.demo} target="_blank" rel="noreferrer">
                  Демо
                </a>
              )}
              {p.links?.github && (
                <a className="accent-code underline-offset-4 hover:underline" href={p.links.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              )}
              {p.links?.case && (
                <a className="accent-code underline-offset-4 hover:underline" href={p.links.case} target="_blank" rel="noreferrer">
                  Кейс
                </a>
              )}
            </div>
          </GlassCard>
        ))}

        {filtered.length === 0 && (
          <GlassCard className="md:col-span-2">
            <div className="text-muted">
              Пока пусто. Добавьте проекты со статусом &quot;{tabs.find((t) => t.value === tab)?.label}&quot;.
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}


