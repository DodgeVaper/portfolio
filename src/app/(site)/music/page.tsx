import Image from 'next/image';
import Link from 'next/link';
import { GlassCard } from '@/components/GlassCard';
import { AudioPreview } from '@/components/AudioPreview';
import { reader } from '@/lib/keystatic';

export default async function MusicPage() {
  let all: Awaited<ReturnType<typeof reader.collections.releases.all>>;
  try {
    all = await reader.collections.releases.all();
  } catch (error) {
    console.error('Failed to read releases:', error);
    all = [];
  }

  return (
    <div className="container-pad py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Music</h1>
        <p className="mt-4 text-muted">Релизы с превью и ссылками на стриминги. Управляется через /keystatic.</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {all.map((r) => (
          <GlassCard key={r.slug}>
            <div className="flex gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-xl bg-white/5">
                {r.entry.cover ? (
                  <Image src={r.entry.cover} alt={r.entry.title} width={160} height={160} className="h-20 w-20 object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted">{r.entry.year}</div>
                <div className="mt-1 truncate font-mono text-lg accent-music">{r.entry.title}</div>
                <div className="mt-1 text-sm text-muted">{r.entry.genre}</div>
              </div>
            </div>

            {r.entry.audioPreview ? <AudioPreview src={r.entry.audioPreview} /> : <div className="mt-4 text-sm text-muted">Добавьте audio preview.</div>}

            <div className="mt-5 grid gap-2 text-sm text-muted">
              {r.entry.inspiration ? <div><span className="font-medium text-[color:var(--fg)]">Вдохновение:</span> {r.entry.inspiration}</div> : null}
              {r.entry.gear ? <div><span className="font-medium text-[color:var(--fg)]">Оборудование:</span> {r.entry.gear}</div> : null}
            </div>

            {!!(r.entry.links?.length) && (
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {r.entry.links!.map((l, idx) => (
                  <a key={idx} href={l.url} target="_blank" rel="noreferrer" className="accent-music underline-offset-4 hover:underline">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </GlassCard>
        ))}

        {all.length === 0 && (
          <GlassCard className="md:col-span-2">
            <div className="text-muted">
              Пока нет релизов. Добавьте их в админке:{' '}
              <Link className="underline" href="/keystatic">
                /keystatic
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}


