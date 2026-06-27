"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import InfluencerCard from "@/components/cards/InfluencerCard";

const MOCK = [
  {
    id: 1,
    name: "Arlene McCoy",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "19M",
    rate: "4.2",
  },
  {
    id: 2,
    name: "Robert Fox",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "19M",
    rate: "4.2",
  },
  {
    id: 3,
    name: "Cody Fisher",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "19M",
    rate: "4.2",
  },
  {
    id: 4,
    name: "Marvin McKinney",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "19M",
    rate: "4.2",
  },
  {
    id: 5,
    name: "Guy Hawkins",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "19M",
    rate: "4.2",
  },
  {
    id: 6,
    name: "Lina Armand",
    platforms: ["snapchat", "tiktok", "youtube"],
    followers: "19M",
    rate: "4.2",
  },
];

export default function InfluencerPage({ role }) {
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState({});

  const filtered = MOCK.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleBookmark = id =>
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Influencers</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <span className="text-primary font-medium">Dashboard</span> /
          Influencers
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-[#203430]">Influencer</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-all">
            <Search size={14} className="text-[#63716E] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-sm text-[#203430] placeholder:text-[#63716E]/60 outline-none w-36"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#203430] hover:border-primary/40 transition-colors">
            <SlidersHorizontal size={13} className="text-[#63716E]" />
            Filter
            <ChevronDown size={12} className="text-[#63716E]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(inf => (
          <InfluencerCard
            key={inf.id}
            {...inf}
            variant="influencer"
            bookmarked={!!bookmarks[inf.id]}
            onBookmark={() => toggleBookmark(inf.id)}
            onChat={() => console.log("chat", inf.id)}
            onProposeDeal={() => console.log("propose", inf.id)}
          />
        ))}
      </div>
    </div>
  );
}
