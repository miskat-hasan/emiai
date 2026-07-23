"use client";

import { setStep } from "@/redux/slices/adCreationSlice";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AdsReactionChart from "./AdsReactionChart";
import {
  AdActionButtons,
  AdDescription,
  AdDetailHero,
  AdInfoCard,
  AdTopRanking,
  AdUserBar,
} from "./index";

// Dynamically import CreateAdFlow to avoid SSR issues
const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });

const mockAds = {
  1: {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&auto=format&fit=crop&q=80",
    userName: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/150?u=janesmith",
    likes: 24,
    views: 24,
    boostLabel: "",
    description: [
      "Step into a night of unparalleled elegance at the Black Diamond Ball, a collaboration between Lumina Moda and renowned designer, Seraphina Dubois!",
      "Experience an evening where fashion transcends artistry, with a showcase of exclusive designs and breathtaking displays.",
      "Indulge in gourmet cuisine, captivating music, and the company of the city's most stylish elite. Secure your tickets now for a gala that promises to be the highlight of the social calendar.",
      "Don't miss the chance to be part of this extraordinary fusion of style and sophistication!",
      "--",
    ],
    info: [
      { label: "Ads Create", value: "Jane Smith" },
      { label: "Ads Reaction", value: "213" },
      { label: "Prize Number", value: "03" },
      { label: "Publish Time", value: "11:59 PM" },
      { label: "Publish Date", value: "Feb 15, 2026" },
    ],
    topRankings: [
      {
        id: 1,
        name: "Jane Cooper",
        role: "Influencer",
        score: 1000,
        avatar: "https://i.pravatar.cc/150?u=jane",
      },
      {
        id: 2,
        name: "Jane Cooper",
        role: "Influencer",
        score: 900,
        avatar: "https://i.pravatar.cc/150?u=janec",
      },
      {
        id: 3,
        name: "Jenny Wilson",
        role: "Advertiser",
        score: 800,
        avatar: "https://i.pravatar.cc/150?u=jenny",
      },
      {
        id: 4,
        name: "Floyd Miles",
        role: "Guest",
        score: 700,
        avatar: "https://i.pravatar.cc/150?u=floyd",
      },
      {
        id: 5,
        name: "David Johnson",
        role: "Guest",
        score: 550,
        avatar: "https://i.pravatar.cc/150?u=david",
      },
    ],
  },
};

export default function PublishedAdDetailsPage({ role, adId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const ad = mockAds[adId] || mockAds[1];

  const handleEdit = () => {
    // Dispatch action to open edit modal (CreateAdFlow handles 'create_ad' step)
    dispatch(setStep("create_ad"));
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    toast.success("Ad deleted successfully");
    setShowDeleteModal(false);
    router.push(`/dashboard/${role}/published-ads`);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Published Ads</h1>
          <p className="text-sm text-gray mt-0.5">
            <Link
              href={`/dashboard/${role}`}
              className="text-primary font-medium hover:underline"
            >
              Dashboard
            </Link>
            {" / "}
            <Link
              href={`/dashboard/${role}/published-ads`}
              className="text-primary font-medium hover:underline"
            >
              Published Ads
            </Link>
            {" / "}
            <span>Ads Details</span>
          </p>
        </div>

        {/* Action Buttons */}
        <AdActionButtons onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Hero Image */}
      <AdDetailHero imageUrl={ad.imageUrl} alt="Ad Banner" />

      {/* Main Content Grid (2x2 layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Cell 1: User & Description */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-50 h-full flex flex-col">
          <AdUserBar
            userName={ad.userName}
            userAvatar={ad.userAvatar}
            likes={ad.likes}
            views={ad.views}
            boostLabel={ad.boostLabel}
          />

          <hr className="border-gray-100 my-5" />

          <div className="flex-1">
            <AdDescription description={ad.description} />
          </div>
        </div>

        {/* Cell 2: Ads Information */}
        <div className="h-full">
          <AdInfoCard items={ad.info} />
        </div>

        {/* Cell 3: Reaction Chart */}
        <div className="h-full">
          <AdsReactionChart />
        </div>

        <div className="h-full">
          <AdTopRanking adId={ad.id} rankings={ad.topRankings} />
        </div>
      </div>

      {/* Edit Modal / Flow */}
      <CreateAdFlow />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
          <div
            className="absolute inset-0"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-black mb-2">Delete Ad</h3>
            <p className="text-gray mb-6 text-sm">
              Are you sure you want to delete this ad? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 text-black text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
