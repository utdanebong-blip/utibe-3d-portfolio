import { useState, useRef, useEffect, useCallback } from 'react';

export function useCountUp(end: number, duration: number = 1500, startOnMount: boolean = true) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(easeOut * end);
      setCount(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [duration, end]);

  useEffect(() => {
    if (startOnMount) start();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, startOnMount]);

  return { count, start, hasStarted: startedRef.current };
}
