"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import AgencyCard from "@/components/cards/AgencyCard";

const MOCK = [
  {
    id: 1,
    name: "Annette Black",
    rating: 4.9,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    commission: "10%",
    successfulDeals: 50,
  },
  {
    id: 2,
    name: "Wade Warren",
    rating: 4.9,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    commission: "10%",
    successfulDeals: 50,
  },
  {
    id: 3,
    name: "Floyd Miles",
    rating: 4.9,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    commission: "10%",
    successfulDeals: 50,
  },
  {
    id: 4,
    name: "Courtney Henry",
    rating: 4.9,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    commission: "10%",
    successfulDeals: 50,
  },
  {
    id: 5,
    name: "Darrell Steward",
    rating: 4.9,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    commission: "10%",
    successfulDeals: 50,
  },
  {
    id: 6,
    name: "Dianne Russell",
    rating: 4.9,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    commission: "10%",
    successfulDeals: 50,
  },
];

export default function AgenciesPage() {
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState({});

  const filtered = MOCK.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Agencies</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <span className="text-primary font-medium">Dashboard</span> / Agencies
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-[#203430]">Agencies</h2>
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
        {filtered.map(agency => (
          <AgencyCard
            key={agency.id}
            {...agency}
            bookmarked={!!bookmarks[agency.id]}
            onBookmark={() =>
              setBookmarks(p => ({ ...p, [agency.id]: !p[agency.id] }))
            }
            onContact={() => console.log("contact", agency.id)}
          />
        ))}
      </div>
    </div>
  );
}
