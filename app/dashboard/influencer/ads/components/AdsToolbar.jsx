import React from "react";
import { Search } from "lucide-react";

export default function AdsToolbar({ searchQuery, setSearchQuery, onPost }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Section title */}
      <h2 className="text-lg font-bold text-black">Ads</h2>

      {/* Search + Post */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-48 focus-within:border-primary/40 focus-within:bg-white transition-all">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Ads here"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Post button */}
        <button
          onClick={onPost}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
        >
          Post
        </button>
      </div>
    </div>
  );
}
