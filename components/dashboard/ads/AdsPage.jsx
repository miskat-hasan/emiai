"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdsGrid } from "./index";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/redux/slices/adCreationSlice";
import TabSwitcher from "@/components/common/TabSwitcher";
import { Search } from "lucide-react";

// Dynamically import CreateAdFlow and PostPreview to avoid SSR issues
const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });
const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

import {
  useGetPublishedAdsQuery,
  useGetAllAdsQuery,
} from "@/redux/api/services/adApi";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";

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

const TABS = [
  { key: "all-ads", label: "All Ads" },
  { key: "my-ads", label: "My Ads" },
];

export default function AdsPage({ role }) {
  const isGuest = role === "guest";
  const [activeTab, setActiveTab] = useState("all-ads");
  const [statusFilter, setStatusFilter] = useState("all");

  // Always fetch all ads; only fetch my ads if not guest
  const { data: allAdsResponse, isLoading: isLoadingAllAds } =
    useGetAllAdsQuery();
  const { data: myAdsResponse, isLoading: isLoadingMyAds } =
    useGetPublishedAdsQuery(undefined, { skip: isGuest });

  // Select active data source
  const response =
    activeTab === "all-ads" || isGuest ? allAdsResponse : myAdsResponse;
  const isLoading =
    activeTab === "all-ads" || isGuest ? isLoadingAllAds : isLoadingMyAds;

  let rawAds = [];
  if (Array.isArray(response)) rawAds = response;
  else if (Array.isArray(response?.data)) rawAds = response.data;
  else if (Array.isArray(response?.data?.data)) rawAds = response.data.data;

  const mappedAds = rawAds.map((ad) => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team";
    const origin = new URL(apiUrl).origin;
    let imageUrl = ad.media_url;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${origin}${imageUrl}`;
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
      userName: "Advertiser " + ad.advertiser_id, // Fallback if no advertiser details are in response
      userAvatar: "https://i.pravatar.cc/150?u=" + ad.advertiser_id,
      description: ad.description,
      timeAgo: timeSince(ad.publish_at || ad.created_at),
      status: ad.status || "active",
      publishAt: ad.publish_at || null,
      is_bookmarked: ad.is_bookmarked || false,
    };
  });

  const [bookmarkedAds, setBookmarkedAds] = useState([]);

  useEffect(() => {
    if (rawAds && rawAds.length > 0) {
      setBookmarkedAds(
        rawAds.filter((ad) => ad.is_bookmarked).map((ad) => ad.id),
      );
    }
  }, [rawAds]);

  const [toggleBookmark] = useToggleBookmarkMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();
  const step = useSelector((state) => state.adCreation.step);

  const finalAds = mappedAds.map((ad) => ({
    ...ad,
    isBookmarked: bookmarkedAds.includes(ad.id),
  }));

  const filteredAds = finalAds.filter((ad) => {
    const matchesSearch =
      ad.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.description &&
        ad.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || ad.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleBookmarkToggle = async (id) => {
    setBookmarkedAds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id],
    );
    try {
      await toggleBookmark({ id, type: "ad" }).unwrap();
    } catch (error) {
      // Revert on failure
      setBookmarkedAds((prev) =>
        prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id],
      );
    }
  };

  const handleAdClick = (id) => {
    // If we are in "Published Ads" page, URL might be different, but AdsPage handles this dynamically via `role/ads` or similar
    router.push(`/dashboard/${role}/ads/${id}`);
  };

  const handlePost = () => {
    dispatch(setStep("create_ad"));
  };

  if (step === "preview") {
    return <PostPreview />;
  }

  return (
    <div className="space-y-5 font-dm-sans">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Published Ads</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Ads</span>
        </p>
      </div>

      {/* Toolbar & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left side: Tabs */}
        {!isGuest ? (
          <TabSwitcher tabs={TABS} active={activeTab} onChange={setActiveTab} />
        ) : (
          <h2 className="text-lg font-bold text-black">All Ads</h2>
        )}

        {/* Right side: Search, Filter, Post */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter (only relevant if not guest, or if backend supports it. The user wants it specifically for scheduled ads) */}
          {activeTab === "my-ads" && (
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2 h-[42px] focus-within:border-primary/40 focus-within:bg-white transition-all">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-black outline-none w-full h-full cursor-pointer px-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          )}

          {/* Search input */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-[42px] w-48 focus-within:border-primary/40 focus-within:bg-white transition-all">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Ads here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Post button */}
          {!isGuest && (
            <button
              onClick={handlePost}
              className="px-6 h-[42px] rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              Post
            </button>
          )}
        </div>
      </div>

      {/* Ads grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AdCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAds.length > 0 ? (
        <AdsGrid
          ads={filteredAds}
          activeTab={activeTab}
          onAdClick={handleAdClick}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ) : (
        <div className="flex justify-center py-20 text-gray">No ads found.</div>
      )}

      {/* Create Ad Flow Modals */}
      <CreateAdFlow />
    </div>
  );
}
