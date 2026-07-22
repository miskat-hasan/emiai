"use client";

import TabSwitcher from "@/components/common/TabSwitcher";
import Pagination from "@/components/ui/Pagination";
import { getImageUrl } from "@/helper/getImageUrl";
import { useGetGuestExploreAdsQuery } from "@/redux/api/services/adApi";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";
import { useStoreInteractionMutation } from "@/redux/api/services/interactionApi";
import { Calendar, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExploreFeedView from "./ExploreFeedView";
import ExploreFilterModal from "./ExploreFilterModal";
import ExploreReelsView from "./ExploreReelsView";

const DEFAULT_PER_PAGE = 12;

// Utility to calculate time ago or time until
function timeSince(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diff = Math.floor((new Date() - date) / 1000);
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;
  const suffix = isFuture ? "" : " ago";
  const prefix = isFuture ? "in " : "";

  let interval = absDiff / 31536000;
  if (interval > 1)
    return (
      prefix +
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " year" : " years") +
      suffix
    );
  interval = absDiff / 2592000;
  if (interval > 1)
    return (
      prefix +
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " month" : " months") +
      suffix
    );
  interval = absDiff / 86400;
  if (interval > 1)
    return (
      prefix +
      Math.floor(interval) +
      (Math.floor(interval) === 1 ? " day" : " days") +
      suffix
    );
  interval = absDiff / 3600;
  if (interval > 1) return prefix + Math.floor(interval) + " hrs" + suffix;
  interval = absDiff / 60;
  if (interval > 1) return prefix + Math.floor(interval) + " mins" + suffix;
  return isFuture ? "in a moment" : "just now";
}

const FeedSkeleton = () => (
  <div className="w-full flex flex-col pt-6 pb-4 border-b border-gray-100 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="mt-4 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="w-full aspect-[16/9] bg-gray-200 rounded-md mt-4"></div>
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
  { key: "gift-hub", label: "Gift Hub" },
];

export default function ExplorePage({ role }) {
  const [activeTab, setActiveTab] = useState("your-interests");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

  const queryType = "all"; // Show all types of ads for the guest user
  const { data: exploreAdsResponse, isLoading } = useGetGuestExploreAdsQuery({
    type: queryType,
    page,
    per_page: perPage,
  });

  const [bookmarkedApiAds, setBookmarkedApiAds] = useState([]);
  const [likedAds, setLikedAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();
  const [storeInteraction] = useStoreInteractionMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  let rawAds = [];
  if (Array.isArray(exploreAdsResponse)) rawAds = exploreAdsResponse;
  else if (Array.isArray(exploreAdsResponse?.data))
    rawAds = exploreAdsResponse.data;
  else if (Array.isArray(exploreAdsResponse?.data?.data))
    rawAds = exploreAdsResponse.data.data;

  const meta = exploreAdsResponse?.meta || exploreAdsResponse?.data;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? rawAds.length;

  const mappedApiAds = rawAds.map((ad) => {
    let imageUrl = getImageUrl(ad.media_url);
    let mediaType = ad.media_type;

    if (!mediaType && imageUrl) {
      if (imageUrl.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
        mediaType = "video";
      } else {
        mediaType = "image";
      }
    }

    // Find the first active prize window (ascending by rank/index)
    const activePrize = ad.prizes
      ?.slice()
      .sort(
        (a, b) =>
          (a.rank ?? a.queue_order ?? 0) - (b.rank ?? b.queue_order ?? 0),
      )
      .find((p) => p.window_status === "active" && p.window_ends_at);

    // Format precise date for feed view
    const rawDate = ad.publish_at || ad.created_at;
    let createdAtFormatted = "";
    if (rawDate) {
      const d = new Date(rawDate);
      createdAtFormatted =
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
    }

    return {
      id: ad.id,
      imageUrl,
      mediaType,
      userName: ad.advertiser.name,
      userAvatar: getImageUrl(ad.advertiser.avatar),
      description: ad.description,
      timeAgo: timeSince(rawDate),
      createdAtFormatted,
      isBookmarked: ad.is_bookmarked || false,
      is_liked: ad.is_liked || false,
      targetCountries: ad.target_countries || [],
      prizeWindowEndsAt: activePrize?.window_ends_at || null,
    };
  });

  useEffect(() => {
    if (rawAds && rawAds.length > 0) {
      setBookmarkedApiAds(
        rawAds.filter((ad) => ad.is_bookmarked).map((ad) => ad.id),
      );
      setLikedAds(rawAds.filter((ad) => ad.is_liked).map((ad) => ad.id));
    }
  }, [rawAds]);

  const displayAds = mappedApiAds.map((ad) => ({
    ...ad,
    isBookmarked: bookmarkedApiAds.includes(ad.id),
    is_liked: likedAds.includes(ad.id),
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

  const handleBookmarkToggle = async (id) => {
    setBookmarkedApiAds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id],
    );
    try {
      await toggleBookmark({ id, type: "ad" }).unwrap();
    } catch (err) {
      setBookmarkedApiAds((prev) =>
        prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id],
      );
    }
  };

  const handleLikeToggle = async (id) => {
    setLikedAds((prev) =>
      prev.includes(id) ? prev.filter((lId) => lId !== id) : [...prev, id],
    );
    try {
      await storeInteraction({
        target_id: id,
        target_type: "ad",
        interaction_type: "like",
      }).unwrap();
    } catch (err) {
      setLikedAds((prev) =>
        prev.includes(id) ? prev.filter((lId) => lId !== id) : [...prev, id],
      );
    }
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

        {/* Right side: Search and Date (Only show under Your Interests or Gift Hub) */}
        {(activeTab === "your-interests" || activeTab === "gift-hub") && (
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

      {/* Ads grid (Only show under Your Interests or Gift Hub) */}
      {(activeTab === "your-interests" || activeTab === "gift-hub") &&
        (isLoading ? (
          <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <FeedSkeleton key={i} />
            ))}
          </div>
        ) : filteredAds.length > 0 ? (
          <div>
            <ExploreFeedView
              ads={filteredAds}
              onAdClick={handleAdClick}
              onBookmarkToggle={handleBookmarkToggle}
              onLikeToggle={handleLikeToggle}
            />
            {totalResults > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                perPage={perPage}
                totalResults={totalResults}
                onPageChange={(p) => setPage(p)}
                onPerPageChange={(pp) => {
                  setPerPage(pp);
                  setPage(1);
                }}
              />
            )}
          </div>
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
