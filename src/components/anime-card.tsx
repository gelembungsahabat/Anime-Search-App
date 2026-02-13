import { Link } from "react-router-dom";
import type { AnimeData, FavoriteAnime } from "../types/jikan-types";
import { ScoreBadge } from "./score-badge";

interface AnimeCardProps {
  anime: AnimeData;
  isFavorite: boolean;
  onToggleFavorite: (fav: FavoriteAnime) => void;
}

export function AnimeCard({ anime, isFavorite, onToggleFavorite }: AnimeCardProps) {
  const fav: FavoriteAnime = {
    mal_id: anime.mal_id,
    title: anime.title,
    image_url: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
    score: anime.score,
    type: anime.type,
  };

  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-1">
      <Link to={`/anime/${anime.mal_id}`} className="relative overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 left-2">
          <ScoreBadge score={anime.score} />
        </div>

        {anime.type && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-black/60 text-white backdrop-blur-sm">
            {anime.type}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {anime.episodes && (
            <p className="text-white/90 text-xs">{anime.episodes} episodes</p>
          )}
        </div>
      </Link>

      <div className="flex-1 p-3 flex flex-col gap-1">
        <Link to={`/anime/${anime.mal_id}`}>
          <h4 className="text-sm font-semibold leading-tight line-clamp-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors" title={anime.title}>
            {anime.title}
          </h4>
        </Link>
        {anime.genres.length > 0 && (
          <p className="text-[11px] text-[var(--text-muted)] truncate">
            {anime.genres.map((g) => g.name).join(", ")}
          </p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(fav);
        }}
        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-sm hover:bg-[var(--bg-card-hover)] transition-colors z-10"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isFavorite ? "var(--score-red)" : "none"}
          stroke={isFavorite ? "var(--score-red)" : "var(--text-muted)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
}
