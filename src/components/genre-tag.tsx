export function GenreTag({ name }: { name: string }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
      {name}
    </span>
  );
}
