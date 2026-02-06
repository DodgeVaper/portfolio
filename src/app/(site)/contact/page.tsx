import { GlassCard } from '@/components/GlassCard';
import { ContactForm } from '@/components/ContactForm';
import { SocialIcon } from '@/components/SocialIcon';
import { reader } from '@/lib/keystatic';
import { defaultSettings, type SiteSettings } from '@/lib/site';

export default async function ContactPage() {
  const raw = (await reader.singletons.settings.read()) as Partial<SiteSettings> | null;
  const settings = { ...defaultSettings, ...(raw ?? {}) } as SiteSettings;

  return (
    <div className="container-pad py-14 sm:py-20">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 text-muted">На связи. Соц-сети и направление отправки формы управляются через /keystatic.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="font-mono text-lg">Соцсети</h2>
          <div className="mt-4 grid gap-2">
            {(settings.socialLinks ?? []).map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted transition hover:bg-white/8 hover:text-[color:var(--fg)]"
              >
                <SocialIcon name={s.icon} className="h-4 w-4" />
                <span>{s.label}</span>
                <span className="ml-auto font-mono text-xs opacity-60">→</span>
              </a>
            ))}
            {(settings.socialLinks ?? []).length === 0 && (
              <div className="text-sm text-muted">Добавьте соц-сети в настройках сайта.</div>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-mono text-lg">Форма</h2>
          <p className="mt-2 text-sm text-muted">
            Отправка идёт в Telegram или на Email (SMTP). Секреты — в <code>.env</code>.
          </p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}


