const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Synchronously compute mobile state at render time without subscribing to events.
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}
