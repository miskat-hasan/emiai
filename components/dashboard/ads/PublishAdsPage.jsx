"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdsGrid } from "./index";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "@/redux/slices/adCreationSlice";
import { Image as ImageIcon } from "lucide-react";

// Dynamically import CreateAdFlow and PostPreview to avoid SSR issues
const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });
const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

// Mock data
const PUBLISHED_ADS = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60",
    userName: "Devon Lane",
    userAvatar: "https://i.pravatar.cc/150?u=devon",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
    isBookmarked: true,
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60",
    userName: "Jacob Jones",
    userAvatar: "https://i.pravatar.cc/150?u=jacob",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&auto=format&fit=crop&q=60",
    userName: "Albert Flores",
    userAvatar: "https://i.pravatar.cc/150?u=albert",
    description: "Summer Fashion Collection...",
    timeAgo: "2 day ago",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=600&auto=format&fit=crop&q=60",
    userName: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/150?u=jane",
    description: "Summer Fashion Collection...",
    timeAgo: "1 day ago",
    isBookmarked: true,
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60",
    userName: "Cameron Williamson",
    userAvatar: "https://i.pravatar.cc/150?u=cameron",
    description: "Summer Fashion Collection...",
    timeAgo: "2 hrs ago",
  },
  {
    id: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=60",
    userName: "Michael Johnson",
    userAvatar: "https://i.pravatar.cc/150?u=michael",
    description: "Autumn Trends - Discover t...",
    timeAgo: "3 days ago",
  },
];

export default function PublishAdsPage({ role }) {
  const [adsList, setAdsList] = useState(PUBLISHED_ADS);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();
  const step = useSelector((state) => state.adCreation.step);

  const filteredAds = adsList.filter(
    (ad) =>
      ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookmarkToggle = (id) => {
    setAdsList((prev) =>
      prev.map((ad) =>
        ad.id === id ? { ...ad, isBookmarked: !ad.isBookmarked } : ad
      )
    );
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
