export const fetcher = async <T>(
  ...args: Parameters<typeof fetch>
): Promise<T> => {
  const res = await fetch(...args);
  if (!res.ok) throw new Error("Error from server");
  return res.json() as Promise<T>;
};
