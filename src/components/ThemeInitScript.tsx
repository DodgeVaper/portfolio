export function ThemeInitScript({ defaultTheme }: { defaultTheme: 'dark' | 'light' }) {
  const code = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t='${defaultTheme}';}document.documentElement.dataset.theme=t;}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}


