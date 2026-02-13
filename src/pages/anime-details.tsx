import { Link, useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../utils";
import type {
  AnimeDetailsResponse,
  AnimeCharactersResponse,
  AnimeRecommendationsResponse,
  FavoriteAnime,
} from "../types/jikan-types";
import { ScoreBadge } from "../components/score-badge";
import { GenreTag } from "../components/genre-tag";
import { DetailSkeleton } from "../components/skeleton";
import { useFavorites } from "../hooks/use-favorites";

const API = "https://api.jikan.moe/v4";

export function AnimeDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: detailData, error, isLoading } = useSWR<AnimeDetailsResponse>(
    id ? `${API}/anime/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: charaData } = useSWR<AnimeCharactersResponse>(
    id ? `${API}/anime/${id}/characters` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: recsData } = useSWR<AnimeRecommendationsResponse>(
    id ? `${API}/anime/${id}/recommendations` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--score-red)] text-lg">Failed to load anime details.</p>
        <Link to="/search" className="mt-4 inline-block text-[var(--accent)] hover:underline">
          Back to Search
        </Link>
      </div>
    );
  }

  if (isLoading || !detailData) return <DetailSkeleton />;

  const anime = detailData.data;
  const mainCharacters = charaData?.data.filter((c) => c.role === "Main") ?? [];
  const supportingCharacters = charaData?.data.filter((c) => c.role === "Supporting").slice(0, 12) ?? [];
  const recommendations = recsData?.data.slice(0, 8) ?? [];

  const fav: FavoriteAnime = {
    mal_id: anime.mal_id,
    title: anime.title,
    image_url: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
    score: anime.score,
    type: anime.type,
  };

  const infoItems = [
    { label: "Type", value: anime.type },
    { label: "Episodes", value: anime.episodes },
    { label: "Status", value: anime.status },
    { label: "Source", value: anime.source },
    { label: "Duration", value: anime.duration },
    { label: "Rating", value: anime.rating },
    { label: "Season", value: anime.season && anime.year ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}` : null },
    { label: "Aired", value: anime.aired.prop.string },
  ].filter((item) => item.value);

  return (
    <div className="animate-fade-in">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Search
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <img
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
              alt={anime.title}
              width={288}
              height={384}
              className="w-64 md:w-72 rounded-lg shadow-[var(--shadow-lg)]"
            />
            <button
              onClick={() => toggleFavorite(fav)}
              className={`mt-4 w-64 md:w-72 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isFavorite(anime.mal_id)
                  ? "bg-[var(--score-red)] text-white"
                  : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--score-red)] hover:text-[var(--score-red)]"
              }`}
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavorite(anime.mal_id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isFavorite(anime.mal_id) ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="mb-1">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="text-[var(--text-muted)] text-sm mb-1">{anime.title_english}</p>
            )}
            {anime.title_japanese && (
              <p className="text-[var(--text-muted)] text-sm mb-4">{anime.title_japanese}</p>
            )}

            {/* Score + stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {anime.score && (
                <div className="flex items-center gap-2">
                  <ScoreBadge score={anime.score} />
                  {anime.scored_by && (
                    <span className="text-xs text-[var(--text-muted)]">
                      ({anime.scored_by.toLocaleString()} votes)
                    </span>
                  )}
                </div>
              )}
              {anime.rank && (
                <span className="text-sm text-[var(--text-secondary)]">
                  Ranked <strong>#{anime.rank}</strong>
                </span>
              )}
              {anime.popularity && (
                <span className="text-sm text-[var(--text-secondary)]">
                  Popularity <strong>#{anime.popularity}</strong>
                </span>
              )}
              <span className="text-sm text-[var(--text-muted)]">
                {anime.members.toLocaleString()} members
              </span>
            </div>

            {/* Genres */}
            {anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((g) => (
                  <GenreTag key={g.mal_id} name={g.name} />
                ))}
                {anime.themes.map((t) => (
                  <GenreTag key={t.mal_id} name={t.name} />
                ))}
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {infoItems.map(({ label, value }) => (
                <div key={label} className="bg-[var(--bg-secondary)] rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-[var(--text-primary)] m-0">{value}</p>
                </div>
              ))}
            </div>

            {/* Studios */}
            {anime.studios.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">
                  Studios
                </p>
                <p className="text-sm text-[var(--text-primary)] m-0">
                  {anime.studios.map((s) => s.name).join(", ")}
                </p>
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="mb-6">
                <h3 className="mb-2">Synopsis</h3>
                <p className="text-sm leading-relaxed">{anime.synopsis}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer */}
      {anime.trailer.embed_url && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <h2 className="mb-4">Trailer</h2>
          <div className="relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={`${anime.trailer.embed_url}?autoplay=0`}
              title={`${anime.title} trailer`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Characters */}
      {charaData && charaData.data.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          {mainCharacters.length > 0 && (
            <>
              <h2 className="mb-4">Main Characters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {mainCharacters.map((c) => {
                  const japaneseVA = c.voice_actors.find((va) => va.language === "Japanese");
                  return (
                    <div
                      key={c.character.mal_id}
                      className="flex flex-col items-center text-center bg-[var(--bg-card)] rounded-lg p-3 shadow-[var(--shadow-sm)]"
                    >
                      <img
                        src={c.character.images.jpg.image_url}
                        alt={c.character.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover mb-2"
                        loading="lazy"
                      />
                      <p className="text-xs font-semibold text-[var(--text-primary)] m-0 line-clamp-1">
                        {c.character.name}
                      </p>
                      <p className="text-xs text-[var(--accent)] font-medium m-0">{c.role}</p>
                      {japaneseVA && (
                        <p className="text-xs text-[var(--text-muted)] m-0 mt-1 line-clamp-1">
                          CV: {japaneseVA.person.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {supportingCharacters.length > 0 && (
            <>
              <h3 className="mb-4">Supporting Characters</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {supportingCharacters.map((c) => (
                  <div
                    key={c.character.mal_id}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={c.character.images.jpg.image_url}
                      alt={c.character.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover mb-1"
                      loading="lazy"
                    />
                    <p className="text-xs font-medium text-[var(--text-secondary)] m-0 line-clamp-1">
                      {c.character.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <h2 className="mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <Link
                key={rec.entry.mal_id}
                to={`/anime/${rec.entry.mal_id}`}
                className="group flex flex-col rounded-lg overflow-hidden bg-[var(--bg-card)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={rec.entry.images.jpg.large_image_url || rec.entry.images.jpg.image_url}
                  alt={rec.entry.title}
                  width={225}
                  height={300}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-3">
                  <h4 className="text-sm font-semibold line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors m-0">
                    {rec.entry.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1 m-0">
                    {rec.votes} {rec.votes === 1 ? "recommendation" : "recommendations"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
