import { useCallback, useSyncExternalStore } from "react";
import type { FavoriteAnime } from "../types/jikan-types";

const STORAGE_KEY = "anime-favorites";

function getSnapshot(): FavoriteAnime[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let cachedFavorites = getSnapshot();

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedFavorites = getSnapshot();
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function emitChange() {
  cachedFavorites = getSnapshot();
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribe,
    () => cachedFavorites,
    () => []
  );

  const isFavorite = useCallback(
    (malId: number) => favorites.some((f) => f.mal_id === malId),
    [favorites]
  );

  const toggleFavorite = useCallback((anime: FavoriteAnime) => {
    const current = getSnapshot();
    const exists = current.some((f) => f.mal_id === anime.mal_id);
    const updated = exists
      ? current.filter((f) => f.mal_id !== anime.mal_id)
      : [...current, anime];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  const removeFavorite = useCallback((malId: number) => {
    const current = getSnapshot();
    const updated = current.filter((f) => f.mal_id !== malId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChange();
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
