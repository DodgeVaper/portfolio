'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export function AudioPreview({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => setIsPlaying(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnd);
    };
  }, []);

  const pct = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);

  return (
    <div className="mt-4">
      <audio ref={audioRef} src={src} preload="none" />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition hover:opacity-90"
          onClick={async () => {
            const el = audioRef.current;
            if (!el) return;
            if (el.paused) {
              await el.play();
              setIsPlaying(true);
            } else {
              el.pause();
              setIsPlaying(false);
            }
          }}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-2 rounded-full"
            style={{
              width: pct,
              background:
                'linear-gradient(90deg, var(--accent-music), color-mix(in oklab, var(--accent-code), transparent 20%))',
            }}
          />
        </div>
      </div>
    </div>
  );
}


