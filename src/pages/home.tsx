import { Link } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../utils";
import type { AnimeListResponse } from "../types/jikan-types";
import { AnimeCard } from "../components/anime-card";
import { CardGridSkeleton } from "../components/skeleton";
import { useFavorites } from "../hooks/use-favorites";

const API = "https://api.jikan.moe/v4";

export function Home() {
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: topData, isLoading: topLoading } = useSWR<AnimeListResponse>(
    `${API}/top/anime?limit=12`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: seasonData, isLoading: seasonLoading } = useSWR<AnimeListResponse>(
    `${API}/seasons/now?limit=12`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-light)] via-transparent to-transparent opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Discover Your Next
            <span className="block text-[var(--accent)]">Favorite Anime</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Explore thousands of anime titles, track your favorites, and find your next binge-worthy series.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-hover)] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Start Searching
          </Link>
        </div>
      </section>

      {/* Top Anime */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="m-0">Top Anime</h2>
          <Link
            to="/search?order_by=score&sort=desc"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        {topLoading ? (
          <CardGridSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {topData?.data.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                isFavorite={isFavorite(anime.mal_id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      {/* This Season */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="m-0">This Season</h2>
          <Link
            to="/search?status=airing"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>
        {seasonLoading ? (
          <CardGridSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {seasonData?.data.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                isFavorite={isFavorite(anime.mal_id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
