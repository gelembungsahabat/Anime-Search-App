import "./App.css";

function App() {
  return (
    <main>
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
        />
      </div>
    </main>
  );
}

export default App;
