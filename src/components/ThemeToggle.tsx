'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light';

function getThemeFromDOM(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === 'light' ? 'light' : 'dark';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return getThemeFromDOM();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const label = useMemo(
    () => (theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'),
    [theme],
  );

  return (
    <button
      type="button"
      aria-label={label}
      className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition hover:opacity-90"
      onClick={() => {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
      }}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}


