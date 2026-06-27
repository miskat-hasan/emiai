"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TabSwitcher from "@/components/common/TabSwitcher";
import { AdsGrid } from "@/components/dashboard/ads";
import { Search, Calendar, Filter } from "lucide-react";
import ExploreReelsView from "./ExploreReelsView";
import ExploreFilterModal from "./ExploreFilterModal";

// Mock data (same as Ads module)
const EXPLORE_ADS = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60",
    userName: "Jacob Jones",
    userAvatar: "https://i.pravatar.cc/150?u=jacob",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
    isBookmarked: true,
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60",
    userName: "Kathryn Murphy",
    userAvatar: "https://i.pravatar.cc/150?u=kathryn",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=60",
    userName: "Marvin McKinney",
    userAvatar: "https://i.pravatar.cc/150?u=marvin",
    description: "Summer Fashion Collection...",
    timeAgo: "2 day ago",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=600&auto=format&fit=crop&q=60",
    userName: "Esther Howard",
    userAvatar: "https://i.pravatar.cc/150?u=esther",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
    isBookmarked: true,
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60",
    userName: "Leslie Alexander",
    userAvatar: "https://i.pravatar.cc/150?u=leslie",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
  },
  {
    id: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=60",
    userName: "Michael Johnson",
    userAvatar: "https://i.pravatar.cc/150?u=michael",
    description: "Autumn Trends – Discover t...",
    timeAgo: "3 days ago",
  },
];

const TABS = [
  { key: "your-interests", label: "Your Interests" },
  { key: "explore", label: "Explore" },
];

export default function ExplorePage({ role }) {
  const [adsList, setAdsList] = useState(EXPLORE_ADS);
  const [activeTab, setActiveTab] = useState("your-interests");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const filteredAds = adsList.filter(
    ad =>
      ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleBookmarkToggle = id => {
    setAdsList(prev =>
      prev.map(ad =>
        ad.id === id ? { ...ad, isBookmarked: !ad.isBookmarked } : ad
      )
    );
  };

  const handleAdClick = id => {
    // Navigate to the ads details page in the explore module
    router.push(`/dashboard/${role}/explore/${id}`);
  };

  return (
    <div className="space-y-6 font-dm-sans">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Ads</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Explore</span>
          {" / "}
          <span>Ads</span>
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        {/* Left side: Title and Tabs */}
        <div className="flex items-center gap-6 flex-wrap">
          <h2 className="text-lg font-bold text-black">Ads</h2>
          <TabSwitcher tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Right side: Search and Date (Only show under Your Interests) */}
        {activeTab === "your-interests" && (
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium ml-1">Search</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-[200px] focus-within:border-primary/40 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
                />
              </div>
            </div>

            {/* Ads Date Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium ml-1">Ads Date</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-[160px] focus-within:border-primary/40 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="23 Jun 2035"
                  value={dateQuery}
                  onChange={e => setDateQuery(e.target.value)}
                  className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
                />
                <Calendar size={16} className="text-gray-400 shrink-0" />
              </div>
            </div>
          </div>
        )}
        {/* Right side: Filter (Only show under Explore) */}
        {activeTab === "explore" && (
          <div className="flex items-center">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-[#F1DECF] text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        )}
      </div>

      {/* Ads grid (Only show under Your Interests) */}
      {activeTab === "your-interests" && (
        <AdsGrid
          ads={filteredAds}
          onAdClick={handleAdClick}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}

      {/* Reels View (Only show under Explore) */}
      {activeTab === "explore" && (
        <ExploreReelsView ads={filteredAds} />
      )}

      {/* Filter Modal */}
      <ExploreFilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
