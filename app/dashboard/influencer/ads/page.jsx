"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdsToolbar from "./components/AdsToolbar";
import AdsGrid from "./components/AdsGrid";
import CreateAdFlow from "./components/CreateAdFlow";
import PostPreview from "./components/PostPreview";
import { useDispatch, useSelector } from "react-redux";
import { setStep, clearDraft } from "@/redux/slices/adCreationSlice";
// import { useGetPublishedAdsQuery } from "@/redux/api/services/adApi";

// Mock data

const PUBLISHED_ADS = [
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
  {
    id: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60",
    userName: "Jacob Jones",
    userAvatar: "https://i.pravatar.cc/150?u=jacob",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
    isBookmarked: true,
  },
  {
    id: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60",
    userName: "Kathryn Murphy",
    userAvatar: "https://i.pravatar.cc/150?u=kathryn",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
  },
  {
    id: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=60",
    userName: "Marvin McKinney",
    userAvatar: "https://i.pravatar.cc/150?u=marvin",
    description: "Summer Fashion Collection...",
    timeAgo: "2 day ago",
  },
  {
    id: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=600&auto=format&fit=crop&q=60",
    userName: "Esther Howard",
    userAvatar: "https://i.pravatar.cc/150?u=esther",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
    isBookmarked: true,
  },
  {
    id: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60",
    userName: "Leslie Alexander",
    userAvatar: "https://i.pravatar.cc/150?u=leslie",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
  },
  {
    id: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=60",
    userName: "Michael Johnson",
    userAvatar: "https://i.pravatar.cc/150?u=michael",
    description: "Autumn Trends – Discover t...",
    timeAgo: "3 days ago",
  },
];

// Page

export default function AdsPage() {
  const [adsList, setAdsList] = useState(PUBLISHED_ADS);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const dispatch = useDispatch();
  const step = useSelector((state) => state.adCreation.step);

  // When backend is ready
  // const { data: adsData, isLoading } = useGetPublishedAdsQuery();
  // const ads = adsData?.data ?? [];

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
    router.push(`/dashboard/influencer/ads/${id}`);
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
      />

      {/* Ads grid */}
      <AdsGrid
        ads={filteredAds}
        onAdClick={handleAdClick}
        onBookmarkToggle={handleBookmarkToggle}
      />

      {/* Create Ad Flow Modals */}
      <CreateAdFlow />
    </div>
  );
}