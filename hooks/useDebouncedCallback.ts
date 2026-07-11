// hooks/useDebouncedCallback.ts
import { useEffect, useRef } from 'react';

export function useDebouncedCallback(callback: () => void, delay: number = 300) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFunction = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);
  };

  return debouncedFunction;
}
