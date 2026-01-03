// useLocalStorage removed to enforce static-only data sources.
export function useLocalStorage<T>() {
  throw new Error('useLocalStorage was removed — data is static and must be imported from code.');
}
