"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import InfluencerCard from "@/components/cards/InfluencerCard";
import AIPredictionModal from "@/components/modals/AIPredictionModal";
import SmartMatchingFilterModal from "@/components/modals/SmartMatchingFilterModal";

const MOCK = [
  {
    id: 1,
    name: "Annette Black",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "2.1M",
    rate: "4.9",
    matchPct: 95,
    whyFit:
      "As a leading voice in tech and innovation, Annette Black is ideal for showcasing cutting-edge products and attracting tech-savvy audiences.",
  },
  {
    id: 2,
    name: "Wade Warren",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "1.8M",
    rate: "4.8",
    matchPct: 95,
    whyFit:
      "Known for her engaging travel vlogs and stunning photography, Wade Warren is an excellent fit for adventure and tourism campaigns.",
  },
  {
    id: 3,
    name: "Floyd Miles",
    platforms: ["instagram", "youtube", "tiktok"],
    followers: "3.2M",
    rate: "4.7",
    matchPct: 95,
    whyFit:
      "With a focus on sustainable living and eco-friendly choices, Floyd Miles is perfect for brands promoting environmental responsibility.",
  },
  {
    id: 4,
    name: "Kai Azure",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "900K",
    rate: "4.6",
    matchPct: 95,
    whyFit:
      "Specializing in fitness and wellness, Kai Azure inspires a healthy lifestyle, making him a great partner for health and nutrition brands.",
  },
  {
    id: 5,
    name: "Chef Lila Stone",
    platforms: ["instagram", "youtube", "tiktok"],
    followers: "1.4M",
    rate: "4.9",
    matchPct: 95,
    whyFit:
      "Renowned for her gourmet cooking tutorials and restaurant reviews, Chef Lila Stone is a top pick for food and beverage promotions.",
  },
  {
    id: 6,
    name: "Idris Ember",
    platforms: ["instagram", "tiktok", "facebook"],
    followers: "2.7M",
    rate: "4.8",
    matchPct: 95,
    whyFit:
      "Championing diversity and inclusion, Idris Ember is perfect for brands that value social responsibility and aim for broad appeal.",
  },
];

export default function SmartMatchingPage({ role }) {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [predOpen, setPredOpen] = useState(false);
  const [activeInf, setActiveInf] = useState(null);
  const [bookmarks, setBookmarks] = useState({});

  const filtered = MOCK.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openPrediction = inf => {
    setActiveInf(inf);
    setPredOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#203430]">Smart Matching</h1>
          <p className="text-sm text-[#63716E] mt-0.5">
            <span className="text-primary font-medium">Dashboard</span> / Smart
            Matching
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-semibold text-[#203430]">
            Smart Matching
          </h2>
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
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#203430] hover:border-secondary/40 transition-colors"
            >
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
              variant="smart-matching"
              bookmarked={!!bookmarks[inf.id]}
              onBookmark={() =>
                setBookmarks(p => ({ ...p, [inf.id]: !p[inf.id] }))
              }
              onAIPredict={() => openPrediction(inf)}
              onChat={() => console.log("chat", inf.id)}
              onProposeDeal={() => console.log("propose", inf.id)}
            />
          ))}
        </div>
      </div>

      <AIPredictionModal
        open={predOpen}
        onClose={() => {
          setPredOpen(false);
          setActiveInf(null);
        }}
        influencer={activeInf}
      />

      <SmartMatchingFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={filters => console.log("filters", filters)}
      />
    </>
  );
}
