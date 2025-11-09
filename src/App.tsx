import "./App.css";
import { useDebouncedCallback } from "use-debounce";
import { Activity, useState } from "react";
import { fetcher } from "./utils";
import useSWR from "swr";
import type { AnimeList } from "./types/jikan-types";

function App() {
  const [animeTitle, setAnimeTitle] = useState<string>("");
  const [pagination, setPagination] = useState<number>(1);
  const limit = 10;
  const { data, isLoading, error, mutate } = useSWR<AnimeList>(
    `https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=${limit}&page=${pagination}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    }
  );
  const debounced = useDebouncedCallback((inputValue) => {
    setAnimeTitle(inputValue);
    mutate();
  }, 250); // 250ms is given interval from the YoPrint's rules

  const prevPage = () => {
    if (pagination > 0) {
      setPagination((prev) => prev - 1);
    }
  };
  const nextPage = () => {
    if (data && pagination < data.pagination.last_visible_page) {
      setPagination((prev) => prev + 1);
    }
  };
  return (
    <main>
      <section>
        <Activity mode={data ? "hidden" : "visible"}>
          <h1>Anime Search App</h1>
        </Activity>
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="anime-search-input" className="flex-1 opacity-80">
            Search your favourite anime here:
          </label>
          <input
            id="anime-search-input"
            type="text"
            className="flex-1  border rounded-lg py-2 px-6"
            placeholder="e.g. Kimi no Na wa"
            onChange={(e) => debounced(e.target.value)}
          />
          {isLoading && <p>loading...</p>}
          {error?.message && <p className="text-red-800">{error?.message}</p>}
        </div>
      </section>
      <section>
        <Activity mode={data ? "visible" : "hidden"}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 place-items-center border-2 border-gray-400 rounded-3xl m-8">
            {data?.data.map((val, idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-center m-2 w-40"
                >
                  <img
                    src={`${val.images.jpg.image_url}`}
                    alt="anime image"
                    className="h-56 max-w-40"
                  />
                  <h4>{val.title}</h4>
                </div>
              );
            })}
          </div>
          {
            <div className="flex flex-row justify-center">
              <button onClick={prevPage}>previous page</button>{" "}
              <p>{data?.pagination.current_page}</p> ...{" "}
              <p>{data?.pagination.last_visible_page}</p>
              <button onClick={nextPage}>next page</button>
            </div>
          }
        </Activity>
      </section>
    </main>
  );
}

export default App;
