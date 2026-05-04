import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { searchPosts, fetchPosts, setSearchQuery, setActiveSubreddit, setSortOrder } from "../features/posts/postsSlice";

const SUBREDDITS = [
  { id: "programming", label: "Programming" },
  { id: "javascript", label: "JavaScript" },
  { id: "reactjs", label: "React" },
  { id: "webdev", label: "Web Dev" },
  { id: "hiphopheads", label: "Hip Hop" },
  { id: "indieheads", label: "Indie" },
  { id: "electronicmusic", label: "Electronic" },
  { id: "technews", label: "Tech News" },
];

const SORT_OPTIONS = [
  { value: "hot", label: "🔥 Hot" },
  { value: "new", label: "✨ New" },
  { value: "top", label: "⬆️ Top" },
  { value: "rising", label: "📈 Rising" },
];

interface NavbarProps {
  darkMode: boolean;
  toggleDark: () => void;
  lang: string;
  toggleLang: () => void;
  activeSub: string;
  sort: string;
}

export default function Navbar({ darkMode, toggleDark, lang, toggleLang, activeSub, sort }: NavbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      dispatch(setSearchQuery(input));
      dispatch(searchPosts(input));
    },
    [input, dispatch]
  );

  const handleClear = () => {
    setInput("");
    dispatch(setSearchQuery(""));
    dispatch(fetchPosts(activeSub));
  };

  const handleSubreddit = (id: string) => {
    dispatch(setActiveSubreddit(id));
    dispatch(fetchPosts(id));
    setInput("");
  };

  const handleSort = (value: string) => {
    dispatch(setSortOrder(value));
    dispatch(fetchPosts(activeSub));
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur border-b ${darkMode ? "bg-[#0f1117]/90 border-[#343536]" : "bg-white/90 border-gray-200"}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <span className="font-syne text-xl font-bold text-brand whitespace-nowrap">
          PulseBoard
        </span>

        {/* Search with clear button */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "fr" ? "Rechercher..." : "Search Reddit..."}
            className={`w-full border rounded-full px-4 py-1.5 text-sm outline-none focus:border-brand transition-colors pr-10 ${
              darkMode
                ? "bg-[#1a1d27] border-[#343536] text-[#e8e8e8]"
                : "bg-gray-100 border-gray-300 text-gray-900"
            }`}
          />
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors text-lg leading-none"
            >
              ✕
            </button>
          )}
        </form>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className={`text-xs border rounded-full px-3 py-1.5 outline-none cursor-pointer transition-colors ${
            darkMode
              ? "bg-[#1a1d27] border-[#343536] text-[#e8e8e8]"
              : "bg-gray-100 border-gray-300 text-gray-900"
          }`}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className={`text-xs font-mono border rounded-full px-3 py-1 hover:border-teal transition-colors ${
              darkMode ? "border-[#343536] text-[#e8e8e8]" : "border-gray-300 text-gray-700"
            }`}
          >
            {lang === "en" ? "FR" : "EN"}
          </button>
          <button onClick={toggleDark} className="text-lg" aria-label="Toggle dark mode">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Subreddit chips */}
      <div className="max-w-6xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto">
        {SUBREDDITS.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSubreddit(s.id)}
            className={`whitespace-nowrap text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
              activeSub === s.id
                ? "bg-brand border-brand text-white"
                : darkMode
                ? "border-[#343536] hover:border-brand text-[#818384]"
                : "border-gray-300 hover:border-brand text-gray-500"
            }`}
          >
            r/{s.id}
          </button>
        ))}
      </div>
    </header>
  );
}