import { useSyncExternalStore } from 'react';

/* Stands in for framer-motion's useReducedMotion where importing framer-motion
   would drag it into a bundle that must not contain it (the main bundle, via
   Footer). Same semantics: true when the OS-level reduce-motion preference is
   active, updated live when the setting changes. getServerSnapshot serves the
   prerender, which has no window. */
const getReducedMotionSnapshot = () => window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
};

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}
