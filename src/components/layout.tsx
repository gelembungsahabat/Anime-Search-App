import { Link, NavLink, Outlet } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { ScrollToTop } from "./scroll-to-top";

export function Layout() {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-lg">
        Skip to content
      </a>

      <header className="fixed top-0 left-0 right-0 z-40">
      <nav aria-label="Main navigation" className="bg-[var(--bg-nav)] border-b border-[var(--border-nav)] shadow-sm" style={{ backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--accent)] font-bold text-lg tracking-tight">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            AniSearch
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                }`
              }
            >
              Search
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                }`
              }
            >
              Favorites
            </NavLink>
            <div className="ml-1 sm:ml-2 border-l border-[var(--border-color)] pl-2 sm:pl-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      </header>

      <main id="main-content" className="flex-1 pt-16">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border-color)] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Powered by{" "}
            <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
              Jikan API
            </a>
            {" "}&middot; Built with React & Tailwind CSS
          </p>
        </div>
      </footer>

      <ScrollToTop />
    </>
  );
}
