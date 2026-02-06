import type { NavItem } from '../components/SiteHeader';

export type SiteSettings = {
  ownerName: string;
  intro: string;
  taglines: readonly string[];
  visuals: {
    defaultTheme: 'dark' | 'light';
    accentCode: string;
    accentMusic: string;
  };
  sections: {
    showAbout: boolean;
    showProjects: boolean;
    showMusic: boolean;
    showBlog: boolean;
    showContact: boolean;
  };
  socialLinks: readonly { label: string; url: string; icon: string }[];
  footer: { copyright: string; quotes: readonly string[] };
  contact:
    | { discriminant: 'telegram'; value: { chatId?: string } }
    | { discriminant: 'smtp'; value: { to?: string } };
};

export const defaultSettings: SiteSettings = {
  ownerName: 'Ваше имя',
  intro: 'Разработчик и музыкант. Делаю продукты и звук.',
  taglines: ['Разработчик', 'Музыкант', 'Создатель'],
  visuals: { defaultTheme: 'dark', accentCode: '#00f5d4', accentMusic: '#f20089' },
  sections: {
    showAbout: true,
    showProjects: true,
    showMusic: true,
    showBlog: true,
    showContact: true,
  },
  socialLinks: [],
  footer: { copyright: `© ${new Date().getFullYear()}`, quotes: ['Build. Ship. Repeat.'] },
  contact: { discriminant: 'telegram', value: { chatId: '' } },
};

export function pickQuote(quotes: readonly string[] | undefined) {
  const list = (quotes ?? []).filter(Boolean);
  if (!list.length) return undefined;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

export function getNav(settings: SiteSettings): NavItem[] {
  const nav: NavItem[] = [];
  if (settings.sections.showAbout) nav.push({ href: '/about', label: 'About' });
  if (settings.sections.showProjects) nav.push({ href: '/projects', label: 'Projects' });
  if (settings.sections.showMusic) nav.push({ href: '/music', label: 'Music' });
  if (settings.sections.showBlog) nav.push({ href: '/blog', label: 'Blog' });
  if (settings.sections.showContact) nav.push({ href: '/contact', label: 'Contact' });
  return nav;
}


