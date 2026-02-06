'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export function TaglineCycle({
  taglines,
  intervalMs = 2200,
}: {
  taglines: readonly string[];
  intervalMs?: number;
}) {
  const safe = useMemo(() => (taglines.length ? taglines : ['Создатель']), [taglines]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIdx((v) => (v + 1) % safe.length), intervalMs);
    return () => window.clearInterval(id);
  }, [safe.length, intervalMs]);

  return (
    <span className="relative inline-block min-w-[12ch] align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${safe[idx]}-${idx}`}
          initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
          transition={{ duration: 0.25 }}
          className="accent-code font-mono"
        >
          {safe[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


