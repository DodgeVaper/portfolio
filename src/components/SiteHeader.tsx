import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { NavItem } from '@/lib/site';

export function SiteHeader({ ownerName, nav }: { ownerName: string; nav: NavItem[] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--bg)]/80 backdrop-blur">
      <div className="container-pad flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-mono text-sm tracking-tight">
          <span className="accent-code">{ownerName || 'Portfolio'}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-[color:var(--fg)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <details className="sm:hidden">
            <summary className="glass cursor-pointer list-none rounded-full px-3 py-2 text-sm">Меню</summary>
            <div className="glass absolute right-5 mt-2 w-56 rounded-2xl p-3">
              <div className="flex flex-col gap-2 text-sm">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-2 py-2 text-muted hover:bg-white/5 hover:text-[color:var(--fg)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}


