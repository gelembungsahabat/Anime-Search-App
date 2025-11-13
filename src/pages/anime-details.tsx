import { Link, useParams } from "react-router-dom";
import { fetcher } from "../utils";
import useSWR from "swr";
import type { AnimeCharacters, AnimeDetails } from "../types/jikan-types";

export function AnimeDetails() {
  const { id } = useParams();
  const {
    data: animeDetailsData,
    error,
    isLoading,
  } = useSWR<AnimeDetails>(
    id ? `https://api.jikan.moe/v4/anime/${id}` : null,
    fetcher
  );
  const { data: charaData } = useSWR<AnimeCharacters>(
    id ? `https://api.jikan.moe/v4/anime/${id}/characters` : null,
    fetcher
  );

  if (error) return <p>Error Loading Details..</p>;
  if (isLoading || !animeDetailsData) return <p>Loading ..</p>;

  const anime = animeDetailsData.data;

  return (
    <div>
      <Link to="/">Back to Search</Link>
      <h2>{anime.title}</h2>
      <div className="flex flex-col md:flex-row gap-10">
        <img
          className="object-cover md:h-[400px] h-auto w-full md:w-auto rounded-lg"
          src={anime.images.jpg.image_url}
          alt={anime.title}
        />
        <p className="text-left">{anime.synopsis}</p>
      </div>

      <h3>Anime Characters</h3>
      <div className="grid grid-cols-10">
        {charaData?.data.map((val, idx) => (
          <>
            <div>
              <img
                src={val.character.images.jpg.image_url}
                alt={anime.title}
                width={100}
              />
              <p key={idx}>{val.character.name}</p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
