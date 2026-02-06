import Image from 'next/image';
import Link from 'next/link';
import { reader } from '@/lib/keystatic';
import { MarkdocContent } from '@/components/MarkdocContent';
import { GlassCard } from '@/components/GlassCard';

export default async function AboutPage() {
  const about = await reader.singletons.about.read();

  const bio = about?.bio ? await about.bio() : null;

  return (
    <div className="container-pad py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">About</h1>
        <p className="mt-4 text-muted">
          Обновляется через админку. Если блок пустой — зайдите в{' '}
          <Link className="underline" href="/keystatic">
            /keystatic
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
        <GlassCard className="h-fit">
          {about?.photo ? (
            <Image
              src={about.photo}
              alt="Portrait"
              width={800}
              height={800}
              className="aspect-square w-full rounded-xl object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-xl bg-white/5" />
          )}
        </GlassCard>

        <GlassCard>
          <div className="prose prose-invert max-w-none prose-p:leading-8 prose-a:text-[color:var(--accent-code)]">
            {bio?.node ? <MarkdocContent node={bio.node} /> : <p className="text-muted">Заполните текст “Обо мне”.</p>}
          </div>
        </GlassCard>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-mono text-lg">Принципы</h2>
          <div className="mt-4 grid gap-4">
            {(about?.principles ?? []).map((p, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-medium">{p.title}</div>
                <div className="mt-1 text-sm text-muted">{p.body}</div>
              </div>
            ))}
            {(about?.principles ?? []).length === 0 && <div className="text-sm text-muted">Добавьте 3–4 принципа в админке.</div>}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-mono text-lg">Стек</h2>
          <div className="mt-4 grid gap-3">
            {(about?.stack ?? []).map((t, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="text-muted">{t.level ?? 0}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/5">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, t.level ?? 0))}%`,
                      background:
                        'linear-gradient(90deg, var(--accent-code), color-mix(in oklab, var(--accent-music), transparent 20%))',
                    }}
                  />
                </div>
              </div>
            ))}
            {(about?.stack ?? []).length === 0 && <div className="text-sm text-muted">Добавьте технологии и уровни владения.</div>}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}


