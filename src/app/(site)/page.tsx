import Link from 'next/link';
import { reader } from '@/lib/keystatic';
import { defaultSettings, type SiteSettings } from '@/lib/site';
import { TaglineCycle } from '@/components/TaglineCycle';
import { GlassCard } from '@/components/GlassCard';

export default async function HomePage() {
  let raw: Partial<SiteSettings> | null = null;
  try {
    raw = (await reader.singletons.settings.read()) as Partial<SiteSettings> | null;
  } catch (error) {
    console.error('Failed to read settings singleton:', error);
  }
  const settings = { ...defaultSettings, ...(raw ?? {}) } as SiteSettings;

  const [projects, releases, posts] = await Promise.all([
    settings.sections.showProjects
      ? reader.collections.projects.all().catch((err) => {
          console.error('Failed to read projects:', err);
          return [];
        })
      : Promise.resolve([]),
    settings.sections.showMusic
      ? reader.collections.releases.all().catch((err) => {
          console.error('Failed to read releases:', err);
          return [];
        })
      : Promise.resolve([]),
    settings.sections.showBlog
      ? reader.collections.posts.all().catch((err) => {
          console.error('Failed to read posts:', err);
          return [];
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <section className="container-pad py-16 sm:py-24">
        <div className="max-w-3xl">
          <div className="text-sm text-muted">Portfolio</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {settings.ownerName}{' '}
            <span className="text-muted">
              / <TaglineCycle taglines={settings.taglines} />
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{settings.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="glass rounded-full px-4 py-2 text-sm transition hover:opacity-90"
            >
              Проекты
            </Link>
            <Link
              href="/music"
              className="glass rounded-full px-4 py-2 text-sm transition hover:opacity-90"
            >
              Музыка
            </Link>
            <Link
              href="/contact"
              className="glass rounded-full px-4 py-2 text-sm transition hover:opacity-90"
            >
              На связи
            </Link>
            <Link
              href="/keystatic"
              className="rounded-full px-4 py-2 text-sm text-muted underline-offset-4 hover:underline"
            >
              Редактировать контент
            </Link>
          </div>
        </div>
      </section>

      {settings.sections.showProjects && (
        <section className="container-pad pb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
            <Link href="/projects" className="text-sm text-muted hover:text-[color:var(--fg)]">
              Все →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <GlassCard key={p.slug}>
                <div className="text-xs text-muted">{p.entry.status}</div>
                <div className="mt-2 font-mono">{p.entry.title}</div>
                <div className="mt-2 text-sm text-muted line-clamp-3">{p.entry.description}</div>
              </GlassCard>
            ))}
            {projects.length === 0 && (
              <GlassCard className="md:col-span-3">
                <div className="text-muted">
                  Пока нет проектов. Добавьте их в админке: <Link className="underline" href="/keystatic">/keystatic</Link>
                </div>
              </GlassCard>
            )}
          </div>
        </section>
      )}

      {settings.sections.showMusic && (
        <section className="container-pad pb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Music</h2>
            <Link href="/music" className="text-sm text-muted hover:text-[color:var(--fg)]">
              Все →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {releases.slice(0, 3).map((r) => (
              <GlassCard key={r.slug}>
                <div className="text-xs text-muted">{r.entry.year}</div>
                <div className="mt-2 font-mono accent-music">{r.entry.title}</div>
                <div className="mt-2 text-sm text-muted">{r.entry.genre}</div>
              </GlassCard>
            ))}
            {releases.length === 0 && (
              <GlassCard className="md:col-span-3">
                <div className="text-muted">
                  Пока нет релизов. Добавьте их в админке: <Link className="underline" href="/keystatic">/keystatic</Link>
                </div>
              </GlassCard>
            )}
          </div>
        </section>
      )}

      {settings.sections.showBlog && (
        <section className="container-pad pb-20">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Blog</h2>
            <Link href="/blog" className="text-sm text-muted hover:text-[color:var(--fg)]">
              Все →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <GlassCard key={p.slug}>
                <div className="text-xs text-muted">
                  {p.entry.date ? new Date(p.entry.date).toLocaleDateString('ru-RU') : '—'}
                </div>
                <div className="mt-2 font-mono">{p.entry.title}</div>
                <div className="mt-2 text-sm text-muted line-clamp-3">{p.entry.excerpt}</div>
                <div className="mt-4">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-sm text-muted underline-offset-4 hover:text-[color:var(--fg)] hover:underline"
                  >
                    Читать →
                  </Link>
                </div>
              </GlassCard>
            ))}
            {posts.length === 0 && (
              <GlassCard className="md:col-span-3">
                <div className="text-muted">
                  Пока нет постов. Добавьте их в админке: <Link className="underline" href="/keystatic">/keystatic</Link>
                </div>
              </GlassCard>
            )}
          </div>
        </section>
      )}
    </div>
  );
}


