import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/use-favorites";

export function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="mb-2">My Favorites</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        {favorites.length} anime saved
      </p>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <svg
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
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="text-[var(--text-muted)] text-lg mb-4">
            No favorites yet
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-all"
          >
            Explore Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {favorites.map((anime) => (
            <div
              key={anime.mal_id}
              className="group relative flex flex-col rounded-lg overflow-hidden bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-1"
            >
              <Link to={`/anime/${anime.mal_id}`} className="relative overflow-hidden">
                <img
                  src={anime.image_url}
                  alt={anime.title}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {anime.score && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-white text-xs font-bold bg-[var(--score-green)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {anime.score.toFixed(1)}
                  </span>
                )}
                {anime.type && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-black/60 text-white backdrop-blur-sm">
                    {anime.type}
                  </span>
                )}
              </Link>

              <div className="flex-1 p-3">
                <Link to={`/anime/${anime.mal_id}`}>
                  <h4 className="text-sm font-semibold leading-tight line-clamp-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                    {anime.title}
                  </h4>
                </Link>
              </div>

              <button
                onClick={() => removeFavorite(anime.mal_id)}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-sm hover:bg-[var(--score-red)] hover:text-white transition-colors z-10"
                aria-label="Remove from favorites"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--score-red)" stroke="var(--score-red)" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
