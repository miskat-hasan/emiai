"use client";

import TabSwitcher from "@/components/common/TabSwitcher";
import { setStep } from "@/redux/slices/adCreationSlice";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@/components/ui/Pagination";
import { AdCardSkeleton, AdsGrid } from "./index";

const DEFAULT_PER_PAGE = 12;

// Dynamically import CreateAdFlow and PostPreview to avoid SSR issues
const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });
const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

import {
  useGetAllAdsQuery,
  useGetPublishedAdsQuery,
} from "@/redux/api/services/adApi";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";
import { getImageUrl } from "@/helper/getImageUrl";

function timeSince(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  const isFuture = seconds < 0;
  const absSeconds = Math.abs(seconds);

  let interval = absSeconds / 31536000;
  if (interval > 1)
    return isFuture
      ? "in " + Math.floor(interval) + " years"
      : Math.floor(interval) + " years ago";
  interval = absSeconds / 2592000;
  if (interval > 1)
    return isFuture
      ? "in " + Math.floor(interval) + " months"
      : Math.floor(interval) + " months ago";
  interval = absSeconds / 86400;
  if (interval > 1)
    return isFuture
      ? "in " + Math.floor(interval) + " days"
      : Math.floor(interval) + " days ago";
  interval = absSeconds / 3600;
  if (interval > 1)
    return isFuture
      ? "in " + Math.floor(interval) + " hrs"
      : Math.floor(interval) + " hrs ago";
  interval = absSeconds / 60;
  if (interval > 1)
    return isFuture
      ? "in " + Math.floor(interval) + " mins"
      : Math.floor(interval) + " mins ago";
  return isFuture
    ? "in " + Math.floor(absSeconds) + " secs"
    : Math.floor(absSeconds) + " secs ago";
}

const TABS = [
  { key: "all-ads", label: "All Ads" },
  { key: "my-ads", label: "My Ads" },
];

export default function AdsPage({ role }) {
  const isGuest = role === "guest";
  const [activeTab, setActiveTab] = useState("all-ads");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingAd, setEditingAd] = useState(null);

  const [pagination, setPagination] = useState({
    "all-ads": { page: 1, perPage: DEFAULT_PER_PAGE },
    "my-ads": { page: 1, perPage: DEFAULT_PER_PAGE },
  });

  const setPage = (tab, page) =>
    setPagination(prev => ({ ...prev, [tab]: { ...prev[tab], page } }));

  const setPerPage = (tab, perPage) =>
    setPagination(prev => ({ ...prev, [tab]: { page: 1, perPage } }));

  // Always fetch all ads; only fetch my ads if not guest
  const { data: allAdsResponse, isLoading: isLoadingAllAds } =
    useGetAllAdsQuery({ page: pagination["all-ads"].page, per_page: pagination["all-ads"].perPage });
  const { data: myAdsResponse, isLoading: isLoadingMyAds } =
    useGetPublishedAdsQuery({ page: pagination["my-ads"].page, per_page: pagination["my-ads"].perPage }, { skip: isGuest });

  // Select active data source
  const response =
    activeTab === "all-ads" || isGuest ? allAdsResponse : myAdsResponse;
  const isLoading =
    activeTab === "all-ads" || isGuest ? isLoadingAllAds : isLoadingMyAds;

  let rawAds = [];
  if (Array.isArray(response)) rawAds = response;
  else if (Array.isArray(response?.data)) rawAds = response.data;
  else if (Array.isArray(response?.data?.data)) rawAds = response.data.data;
  else if (Array.isArray(response?.ads)) rawAds = response.data.data;
  else if (Array.isArray(response?.data?.ads)) rawAds = response.data.data;
  else if (response && typeof response === "object") {
    const possibleArray = Object.values(response).find((val) =>
      Array.isArray(val),
    );
    if (possibleArray) rawAds = possibleArray;
    else if (response.data && typeof response.data === "object") {
      const possibleDataArray = Object.values(response.data).find((val) =>
        Array.isArray(val),
      );
      if (possibleDataArray) rawAds = possibleDataArray;
    }
  }

  const meta = response?.meta || response?.data;
  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? rawAds.length;

  const mappedAds = rawAds.map((ad) => {
    let imageUrl = getImageUrl(ad.media_url);
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
      userName: ad.advertiser.name,
      userAvatar: ad.advertiser.avatar ,
      description: ad.description,
      timeAgo: timeSince(ad.publish_at || ad.created_at),
      status: ad.status || "active",
      publishAt: ad.publish_at || null,
      is_bookmarked: ad.is_bookmarked || false,
      is_liked: ad.is_liked || false,
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
        (Array.isArray(ad.description)
          ? ad.description.join(" ")
          : String(ad.description)
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

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
    // Pass activeTab as source so AdDetailsPage knows if it was clicked from "my-ads"
    router.push(`/dashboard/${role}/ads/${id}?source=${activeTab}`);
  };

  const handlePost = () => {
    setEditingAd(null);
    dispatch(setStep("create_ad"));
  };

  const handleEditClick = (ad) => {
    // The `ad` object here is from finalAds, which was mapped from rawAds.
    // Let's pass the raw ad object to have all original data
    const rawAd = rawAds.find((r) => r.id === ad.id);
    if (rawAd) {
      setEditingAd(rawAd);
      dispatch(setStep("create_ad"));
    }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AdCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAds.length > 0 ? (
        <AdsGrid
          ads={filteredAds}
          activeTab={activeTab}
          onAdClick={handleAdClick}
          onBookmarkToggle={!isGuest ? handleBookmarkToggle : undefined}
          onEditClick={activeTab === "my-ads" ? handleEditClick : undefined}
        />
      ) : (
        <div className="flex justify-center py-20 text-gray">No ads found.</div>
      )}

      {/* Pagination */}
      {totalResults > 0 && (
        <Pagination
          currentPage={pagination[activeTab].page}
          totalPages={totalPages}
          perPage={pagination[activeTab].perPage}
          totalResults={totalResults}
          onPageChange={p => setPage(activeTab, p)}
          onPerPageChange={pp => setPerPage(activeTab, pp)}
        />
      )}

      {/* Create Ad Flow Modals */}
      <CreateAdFlow
        editingAd={editingAd}
        onCloseFlow={() => setEditingAd(null)}
      />
    </div>
  );
}
