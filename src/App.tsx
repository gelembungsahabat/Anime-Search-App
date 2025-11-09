import "./App.css";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { fetcher } from "./utils";
import useSWR from "swr";
import type { AnimeList } from "./types/jikan-types";

function App() {
  const [animeTitle, setAnimeTitle] = useState<string>("");

  const { data, isLoading, mutate } = useSWR<AnimeList>(
    `https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=${5}`,
    fetcher
  );
  const debounced = useDebouncedCallback((inputValue) => {
    setAnimeTitle(inputValue);
    mutate();
  }, 250); // 250ms is given interval from the YoPrint's rules
  return (
    <main>
      <section>
        <h1>Anime Search App</h1>
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
        </div>
      </section>
      <section>
        <ul>
          {data?.data.map((val, idx) => {
            return (
              <li key={idx}>
                {val.title} {val.synopsis}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default App;
