import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { reader } from '@/lib/keystatic';
import { defaultSettings, getNav, pickQuote, type SiteSettings } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ThemeInitScript } from '@/components/ThemeInitScript';

function getValidSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url) return 'http://localhost:3000';
  try {
    new URL(url);
    return url;
  } catch {
    return 'http://localhost:3000';
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let raw: Partial<SiteSettings> | null = null;
  try {
    raw = (await reader.singletons.settings.read()) as unknown as Partial<SiteSettings> | null;
  } catch (error) {
    console.error('Failed to read settings singleton:', error);
  }
  const settings = { ...defaultSettings, ...(raw ?? {}) } as SiteSettings;
  const siteUrl = getValidSiteUrl();
  return {
    title: `${settings.ownerName} — Portfolio`,
    description: settings.intro,
    metadataBase: new URL(siteUrl),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let raw: Partial<SiteSettings> | null = null;
  try {
    raw = (await reader.singletons.settings.read()) as unknown as Partial<SiteSettings> | null;
  } catch (error) {
    console.error('Failed to read settings singleton:', error);
  }
  const settings = { ...defaultSettings, ...(raw ?? {}) } as SiteSettings;

  const nav = getNav(settings);
  const quote = pickQuote(settings.footer?.quotes);

  const cssVars = {
    '--accent-code': settings.visuals?.accentCode ?? defaultSettings.visuals.accentCode,
    '--accent-music': settings.visuals?.accentMusic ?? defaultSettings.visuals.accentMusic,
  } as unknown as CSSProperties;

  return (
    <div style={cssVars}>
      <ThemeInitScript defaultTheme={settings.visuals?.defaultTheme ?? defaultSettings.visuals.defaultTheme} />
      <SiteHeader ownerName={settings.ownerName} nav={nav} />
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(800px circle at 20% 10%, color-mix(in oklab, var(--accent-code), transparent 70%), transparent 60%), radial-gradient(900px circle at 80% 20%, color-mix(in oklab, var(--accent-music), transparent 75%), transparent 55%)',
          }}
        />
        <main className="relative">{children}</main>
      </div>
      <SiteFooter
        nav={nav}
        quote={quote}
        copyright={settings.footer?.copyright ?? defaultSettings.footer.copyright}
      />
    </div>
  );
}


