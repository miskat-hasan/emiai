"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdsToolbar, AdsGrid } from "./index";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/redux/slices/adCreationSlice";

// Dynamically import CreateAdFlow and PostPreview to avoid SSR issues
const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });
const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

import { useGetPublishedAdsQuery, useGetAllAdsQuery } from "@/redux/api/services/adApi";

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

export default function AdsPage({ role }) {
  const { data: myAdsResponse, isLoading: isLoadingMyAds } = useGetPublishedAdsQuery(undefined, { skip: role === "guest" });
  const { data: allAdsResponse, isLoading: isLoadingAllAds } = useGetAllAdsQuery(undefined, { skip: role !== "guest" });

  const response = role === "guest" ? allAdsResponse : myAdsResponse;
  const isLoading = role === "guest" ? isLoadingAllAds : isLoadingMyAds;

  let rawAds = [];
  if (Array.isArray(response)) rawAds = response;
  else if (Array.isArray(response?.data)) rawAds = response.data;
  else if (Array.isArray(response?.data?.data)) rawAds = response.data.data;
  
  const mappedAds = rawAds.map(ad => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team";
    const origin = new URL(apiUrl).origin;
    let imageUrl = ad.media_url;
    if (imageUrl && !imageUrl.startsWith('http')) {
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
      isBookmarked: false, // Default state, might need backend implementation later
    };
  });

  const [bookmarkedAds, setBookmarkedAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const dispatch = useDispatch();
  const step = useSelector((state) => state.adCreation.step);

  const finalAds = mappedAds.map(ad => ({
    ...ad,
    isBookmarked: bookmarkedAds.includes(ad.id),
  }));

  const filteredAds = finalAds.filter(
    ad =>
      ad.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.description && ad.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookmarkToggle = id => {
    setBookmarkedAds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const handleAdClick = id => {
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
          <span>Published Ads</span>
        </p>
      </div>

      {/* search + post */}
      <AdsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPost={handlePost}
        role={role}
      />

      {/* Ads grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
           {[1, 2, 3, 4, 5, 6].map(i => <AdCardSkeleton key={i} />)}
        </div>
      ) : filteredAds.length > 0 ? (
        <AdsGrid
          ads={filteredAds}
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
