import { Link, useParams } from "react-router-dom";
import { fetcher } from "../utils";
import useSWR from "swr";
import type { AnimeDetails } from "../types/jikan-types";

export function AnimeDetails() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR<AnimeDetails>(
    id ? `https://api.jikan.moe/v4/anime/${id}` : null,
    fetcher
  );

  if (error) return <p>Error Loading Details..</p>;
  if (isLoading || !data) return <p>Loading ..</p>;

  const anime = data.data;

  return (
    <div>
      <Link to="/">Back to list</Link>
      <h1>{anime.title}</h1>
      <img src={anime.images.jpg.image_url} alt={anime.title} width={200} />
      <p>{anime.synopsis}</p>
    </div>
  );
}
