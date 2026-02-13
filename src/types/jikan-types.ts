// Shared sub-types

export interface ImageSet {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Images {
  jpg: ImageSet;
  webp: ImageSet;
}

export interface Trailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface DateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Aired {
  from: string | null;
  to: string | null;
  prop: {
    from: DateProp;
    to: DateProp;
    string: string;
  };
}

export interface Broadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface MalEntity {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TitleEntry {
  type: string;
  title: string;
}

// Core anime data

export interface AnimeData {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  approved: boolean;
  titles: TitleEntry[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: Broadcast;
  producers: MalEntity[];
  licensors: MalEntity[];
  studios: MalEntity[];
  genres: MalEntity[];
  explicit_genres: MalEntity[];
  themes: MalEntity[];
  demographics: MalEntity[];
}

// API response types

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeListResponse {
  data: AnimeData[];
  pagination: Pagination;
}

export interface AnimeDetailsResponse {
  data: AnimeData;
}

// Characters

export interface CharacterData {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: { image_url: string };
      webp: { image_url: string; small_image_url: string };
    };
    name: string;
  };
  role: string;
  voice_actors: {
    person: {
      mal_id: number;
      url: string;
      images: { jpg: { image_url: string } };
      name: string;
    };
    language: string;
  }[];
}

export interface AnimeCharactersResponse {
  data: CharacterData[];
}

// Recommendations

export interface RecommendationEntry {
  entry: {
    mal_id: number;
    url: string;
    images: Images;
    title: string;
  };
  votes: number;
}

export interface AnimeRecommendationsResponse {
  data: RecommendationEntry[];
}

// Favorites (localStorage)

export interface FavoriteAnime {
  mal_id: number;
  title: string;
  image_url: string;
  score: number | null;
  type: string | null;
}
