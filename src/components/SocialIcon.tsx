import {
  Github,
  Globe,
  Linkedin,
  Music,
  Send,
  Youtube,
} from 'lucide-react';

export function SocialIcon({ name, className }: { name: string; className?: string }) {
  const props = { className };
  switch (name) {
    case 'github':
      return <Github {...props} />;
    case 'linkedin':
      return <Linkedin {...props} />;
    case 'telegram':
      return <Send {...props} />;
    case 'soundcloud':
    case 'bandcamp':
    case 'spotify':
      return <Music {...props} />;
    case 'youtube':
      return <Youtube {...props} />;
    default:
      return <Globe {...props} />;
  }
}


