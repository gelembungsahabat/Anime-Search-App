export const fetcher = async <T>(
  url: string,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(url, init);
  if (!res.ok)
    throw new Error(
      `You are being rate-limited. Please follow Rate 
      Limiting guidelines: https://docs.api.jikan.moe/#section/Information/Rate-Limiting`
    );
  return res.json() as Promise<T>;
};
