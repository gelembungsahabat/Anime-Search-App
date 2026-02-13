import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import useSWR from "swr";
import { fetcher } from "../utils";
import type { AnimeListResponse } from "../types/jikan-types";
import { AnimeCard } from "../components/anime-card";
import { CardGridSkeleton } from "../components/skeleton";
import { useFavorites } from "../hooks/use-favorites";

const API = "https://api.jikan.moe/v4";
const LIMIT = 24;

const TYPE_OPTIONS = ["", "tv", "movie", "ova", "special", "ona", "music"];
const STATUS_OPTIONS = ["", "airing", "complete", "upcoming"];
const ORDER_OPTIONS = ["", "score", "popularity", "title", "start_date", "episodes", "rank"];

function buildUrl(query: string, page: number, filters: Record<string, string>) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  params.set("limit", String(LIMIT));
  params.set("page", String(page));
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.order_by) {
    params.set("order_by", filters.order_by);
    params.set("sort", filters.sort || "desc");
  }
  return `${API}/anime?${params.toString()}`;
}

export function Search() {
  const [searchParams] = useSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    rating: searchParams.get("rating") || "",
    order_by: searchParams.get("order_by") || "",
    sort: searchParams.get("sort") || "desc",
  });

  const shouldFetch = query || filters.type || filters.status || filters.rating || filters.order_by;

  const { data, isLoading, error } = useSWR<AnimeListResponse>(
    shouldFetch ? buildUrl(query, page, filters) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 300);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const totalPages = data?.pagination.last_visible_page ?? 1;
  const currentPage = data?.pagination.current_page ?? page;

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="mb-2">Search Anime</h1>
        <p className="text-[var(--text-secondary)] m-0">
          Find any anime from thousands of titles
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="anime-search" className="sr-only">Search anime by title</label>
        <div className="relative">
          <svg
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="anime-search"
            type="search"
            className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]"
            placeholder="Search by title... e.g. Attack on Titan"
            onChange={(e) => debounced(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Search filters">
        <select
          aria-label="Filter by type"
          value={filters.type}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.filter(Boolean).map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by rating"
          value={filters.rating}
          onChange={(e) => updateFilter("rating", e.target.value)}
          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
        >
          <option value="">All Ratings</option>
          <option value="g">G - All Ages</option>
          <option value="pg">PG - Children</option>
          <option value="pg13">PG-13 - Teens 13+</option>
          <option value="r17">R - 17+</option>
          <option value="r">R+</option>
        </select>

        <select
          aria-label="Sort order"
          value={filters.order_by}
          onChange={(e) => updateFilter("order_by", e.target.value)}
          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
        >
          <option value="">Default Order</option>
          {ORDER_OPTIONS.filter(Boolean).map((o) => (
            <option key={o} value={o}>
              {o.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        {filters.order_by && (
          <select
            aria-label="Sort direction"
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <p className="text-[var(--score-red)]">{error.message}</p>
        </div>
      )}

      {/* Empty state */}
      {!shouldFetch && !isLoading && (
        <div className="text-center py-20">
          <svg
            aria-hidden="true"
            className="mx-auto mb-4 text-[var(--text-muted)]"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-[var(--text-muted)] text-lg">
            Type a title or select filters to search
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && <CardGridSkeleton count={LIMIT} />}

      {/* Results */}
      {data && !isLoading && (
        <>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {data.pagination.items.total.toLocaleString()} results found
          </p>

          {data.data.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)] text-lg">No anime found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {data.data.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  isFavorite={isFavorite(anime.mal_id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Search results pagination" className="flex items-center justify-center gap-2 mt-10">
              <button
                aria-label="Previous page"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm hover:bg-[var(--bg-card-hover)] disabled:opacity-30"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-[var(--text-muted)]" aria-hidden="true">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    aria-label={`Page ${p}`}
                    aria-current={currentPage === p ? "page" : undefined}
                    onClick={() => goToPage(p as number)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      currentPage === p
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                aria-label="Next page"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm hover:bg-[var(--bg-card-hover)] disabled:opacity-30"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
