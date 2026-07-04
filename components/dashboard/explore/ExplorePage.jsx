"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TabSwitcher from "@/components/common/TabSwitcher";
import { AdsGrid } from "@/components/dashboard/ads";
import { Search, Calendar, Filter } from "lucide-react";
import ExploreReelsView from "./ExploreReelsView";
import ExploreFilterModal from "./ExploreFilterModal";
import { useGetGuestExploreAdsQuery } from "@/redux/api/services/adApi";
import { useStoreInteractionMutation } from "@/redux/api/services/interactionApi";

// Utility to calculate time ago
function timeSince(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hrs ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return Math.floor(seconds) + " secs ago";
}

const AdCardSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-200 animate-pulse">
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10 flex items-center gap-3 w-full">
      <div className="w-11 h-11 rounded-full bg-gray-300 shrink-0 border-2 border-white/30"></div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  </div>
);

const ReelSkeleton = () => (
  <div className="relative w-full max-w-4xl h-full bg-gray-200 animate-pulse rounded-3xl overflow-hidden">
    <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 flex flex-col gap-4 z-10">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
    </div>
    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex items-end justify-between z-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-300 shrink-0 border-2 border-white/30"></div>
        <div className="flex flex-col gap-2 w-48 md:w-64">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

// Remove mock data
const TABS = [
  { key: "your-interests", label: "Your Interests" },
  { key: "explore", label: "Explore" },
];

export default function ExplorePage({ role }) {
  const [activeTab, setActiveTab] = useState("your-interests");

  const queryType = activeTab === "explore" ? "all" : "all"; //we will later use explore, now for showing data we are using all
  const { data: exploreAdsResponse, isLoading } =
    useGetGuestExploreAdsQuery(queryType);

  const [bookmarkedApiAds, setBookmarkedApiAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();
  const [storeInteraction] = useStoreInteractionMutation();

  let rawAds = [];
  if (Array.isArray(exploreAdsResponse)) rawAds = exploreAdsResponse;
  else if (Array.isArray(exploreAdsResponse?.data))
    rawAds = exploreAdsResponse.data;
  else if (Array.isArray(exploreAdsResponse?.data?.data))
    rawAds = exploreAdsResponse.data.data;

  const mappedApiAds = rawAds.map((ad) => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team";
    const origin = new URL(apiUrl).origin;
    let imageUrl = ad.media_url;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${origin}${ad.media_url}`;
    }
    let mediaType = ad.media_type;

    if (!mediaType && imageUrl) {
      if (imageUrl.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
        mediaType = "video";
      } else {
        mediaType = "image";
      }
    }

    return {
      id: ad.id,
      imageUrl,
      mediaType,
      userName: "Advertiser " + ad.advertiser_id,
      userAvatar: "https://i.pravatar.cc/150?u=" + ad.advertiser_id,
      description: ad.description,
      timeAgo: timeSince(ad.publish_at || ad.created_at),
      isBookmarked: ad.is_bookmarked || false,
      targetCountries: ad.target_countries || [],
    };
  });

  useEffect(() => {
    if (rawAds && rawAds.length > 0) {
      setBookmarkedApiAds(
        rawAds.filter((ad) => ad.is_bookmarked).map((ad) => ad.id),
      );
    }
  }, [rawAds]);

  const displayAds = mappedApiAds.map((ad) => ({
    ...ad,
    isBookmarked: bookmarkedApiAds.includes(ad.id),
  }));

  const filteredAds = displayAds.filter((ad) => {
    const matchesSearch =
      ad.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "" ||
      ad.targetCountries.some((tc) => tc.country_code === selectedCountry);
    return matchesSearch && matchesCountry;
  });

  const handleBookmarkToggle = (id) => {
    setBookmarkedApiAds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id],
    );
  };

  const handleAdClick = (id) => {
    // Navigate to the ads details page in the explore module
    if (id) {
      storeInteraction({
        target_id: id,
        target_type: "ad",
        interaction_type: "click",
      }).catch(() => {});
    }
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
              <label className="text-[13px] text-gray-500 font-medium ml-1">
                Search
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-[200px] focus-within:border-primary/40 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
                />
              </div>
            </div>

            {/* Ads Date Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-500 font-medium ml-1">
                Ads Date
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-[160px] focus-within:border-primary/40 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="23 Jun 2035"
                  value={dateQuery}
                  onChange={(e) => setDateQuery(e.target.value)}
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
      {activeTab === "your-interests" &&
        (isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <AdCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAds.length > 0 ? (
          <AdsGrid
            ads={filteredAds}
            onAdClick={handleAdClick}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 mt-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <span className="text-lg font-medium">
              No ads match your filters.
            </span>
            <p className="text-sm mt-1">
              Try adjusting your search or country filter.
            </p>
          </div>
        ))}

      {/* Reels View (Only show under Explore) */}
      {activeTab === "explore" &&
        (isLoading ? (
          <div className="flex flex-col items-center w-full h-[calc(100vh-200px)] overflow-hidden">
            <ReelSkeleton />
          </div>
        ) : (
          <ExploreReelsView ads={filteredAds} />
        ))}

      {/* Filter Modal */}
      <ExploreFilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => setSelectedCountry(filters.country)}
      />
    </div>
  );
}
