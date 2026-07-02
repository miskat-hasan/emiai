"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdsGrid } from "./index";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/redux/slices/adCreationSlice";
import { Image as ImageIcon } from "lucide-react";
import { useGetPublishedAdsQuery } from "@/redux/api/services/adApi";

// Dynamically import CreateAdFlow and PostPreview to avoid SSR issues
const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });
const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

export default function PublishAdsPage({ role }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();
  const step = useSelector((state) => state.adCreation.step);

  const { data: adsResponse, isLoading } = useGetPublishedAdsQuery();
  let adsData = [];
  if (Array.isArray(adsResponse)) adsData = adsResponse;
  else if (Array.isArray(adsResponse?.data)) adsData = adsResponse.data;
  else if (Array.isArray(adsResponse?.data?.data)) adsData = adsResponse.data.data;

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const mappedAds = useMemo(() => {
    return adsData.map((ad) => {
      // Calculate time ago
      const pubDate = new Date(ad.publish_at || ad.created_at);
      const diffMs = new Date() - pubDate;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      let timeAgo = "";
      if (diffDays > 0) timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      else if (diffHours > 0) timeAgo = `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      else timeAgo = "Just now";

      // Form URL using origin to avoid /api/ in path
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://oddeven.thewarriors.team";
      const origin = new URL(apiUrl).origin;
      let imageUrl = ad.media_url;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${origin}${imageUrl}`;
      }
      
      // Fallback if media_url is empty
      if (!imageUrl) {
        imageUrl = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60";
      }

      return {
        id: ad.id,
        imageUrl: imageUrl,
        userName: "Advertiser " + ad.advertiser_id, // Mocked username since API doesn't provide it
        userAvatar: `https://i.pravatar.cc/150?u=${ad.advertiser_id}`,
        description: ad.description,
        timeAgo: timeAgo,
        isBookmarked: bookmarkedIds.has(ad.id),
      };
    });
  }, [adsData, bookmarkedIds]);

  const filteredAds = mappedAds.filter(
    (ad) => {
      const nameMatch = ad.userName?.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = ad.description && ad.description.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || descMatch;
    }
  );

  console.log("PublishAdsPage render:", { adsResponse, adsData, mappedAds, filteredAds, searchQuery });

  const handleBookmarkToggle = (id) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleAdClick = (id) => {
    router.push(`/dashboard/${role}/published-ads/${id}`);
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
          <span>Published Ads</span>
        </p>
      </div>

      {/* custom search + post toolbar to match design without modifying AdsToolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-bold text-black">My Ads</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-48 focus-within:border-primary/40 focus-within:bg-white transition-all">
            <ImageIcon size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Ads here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
            />
          </div>

          {role !== "guest" && (
            <button
              onClick={handlePost}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              Post
            </button>
          )}
        </div>
      </div>

      {/* Ads grid */}
      {isLoading ? (
        <div className="py-20 text-center text-gray">Loading ads...</div>
      ) : (
        <AdsGrid
          ads={filteredAds}
          onAdClick={handleAdClick}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}

      {/* Create Ad Flow Modals */}
      <CreateAdFlow />
    </div>
  );
}
