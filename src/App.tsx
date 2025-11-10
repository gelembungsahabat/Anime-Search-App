import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AnimeDetails, AnimeList } from "./pages";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AnimeList />} />
      <Route path="/details/:id" element={<AnimeDetails />} />
    </Routes>
  );
}

export default App;
