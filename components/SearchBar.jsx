import { useState } from "react";

export default function SearchBar({ neighborhoods = [], onSelect }) {
  const [query, setQuery] = useState("");

  const safeNeighborhoods = neighborhoods.filter(
    (n) => n && n.properties && typeof n.properties.name === "string"
  );

  const results =
    query.trim().length === 0
      ? []
      : safeNeighborhoods
          .filter((n) =>
            n.properties.name
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .slice(0, 6);

  return (
    <div className="absolute top-6 left-6 z-[1000]">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search neighborhood..."
        className="px-4 py-2 w-64 bg-black/60 border border-white/20 rounded-xl text-white focus:outline-none"
      />

      {query && results.length > 0 && (
        <div className="mt-2 bg-black/70 backdrop-blur-lg border border-white/10 rounded-xl">
          {results.map((n) => (
            <p
              key={n.properties.name}
              onClick={() => {
                onSelect(n);
                setQuery("");
              }}
              className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
            >
              {n.properties.name}
            </p>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="mt-2 px-4 py-2 bg-black/70 border border-white/10 rounded-xl text-white/70">
          No results
        </div>
      )}
    </div>
  );
}