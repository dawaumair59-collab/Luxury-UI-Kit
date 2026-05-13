import { useState, useEffect } from "react";

interface UseLoadingOptions {
  duration?: number;
  onComplete?: () => void;
}

export function useLoading({ duration = 2800, onComplete }: UseLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { target: 30, delay: 0 },
      { target: 55, delay: duration * 0.25 },
      { target: 78, delay: duration * 0.5 },
      { target: 92, delay: duration * 0.72 },
      { target: 100, delay: duration * 0.88 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ target, delay }) => {
      const t = setTimeout(() => setProgress(target), delay);
      timers.push(t);
    });

    const done = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, duration);

    timers.push(done);

    return () => timers.forEach(clearTimeout);
  }, [duration, onComplete]);

  return { isLoading, progress };
}
