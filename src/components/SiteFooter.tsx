import Link from 'next/link';
import type { NavItem } from '@/lib/site';

export function SiteFooter({
  copyright,
  quote,
  nav,
}: {
  copyright: string;
  quote?: string;
  nav: NavItem[];
}) {
  return (
    <footer className="border-t border-white/10">
      <div className="container-pad grid gap-6 py-10 md:grid-cols-2 md:items-center">
        <div className="text-sm">
          <div className="text-muted">{quote ? `“${quote}”` : '“Build. Ship. Repeat.”'}</div>
          <div className="mt-2 text-muted">{copyright}</div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-[color:var(--fg)]">
              {item.label}
            </Link>
          ))}
          <Link href="/keystatic" className="text-muted hover:text-[color:var(--fg)]">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}


