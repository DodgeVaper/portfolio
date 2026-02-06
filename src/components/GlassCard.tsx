import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'glass group rounded-2xl p-5 transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      {children}
    </div>
  );
}


