import { useCallback, useRef } from 'react';

export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback((...args: Args): R => ref.current(...args), []);
}
