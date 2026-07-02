"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const ShareModal = dynamic(() => import("@/components/share-app/ShareModal"), { ssr: false });
const CoinsModal = dynamic(() => import("@/components/common/CoinsModal"), { ssr: false });

export default function ShareAppPage({ role }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Hardcoded for now based on the design, could be fetched from API later
  const [invitedCount] = useState(2);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isCoinsModalOpen = searchParams.get("showCoins") === "true";

  const handleCloseCoinsModal = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Share App</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Share App</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-12 pb-20">
        {/* Placeholder image for Gift Box */}
        <div className="relative w-[280px] h-[280px] mb-8">
          <img
            src="/images/rewardbox.png"
            alt="Gift Box Placeholder"
            className="w-full h-full object-contain rounded-3xl mix-blend-multiply"
          />
        </div>
        
        <div className="w-full max-w-[460px]">
          <div className="flex items-center justify-between py-4 mb-8">
            <span className="text-[17px] text-black font-medium">
              Invited Successful
            </span>
            <span className="text-[17px] text-black font-medium">
              {invitedCount}
            </span>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[17px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 cursor-pointer"
          >
            Share & Earn Now
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        link="reelup/sgdoghd-vhxc"
        role={role}
      />

      {/* Coins Modal */}
      <CoinsModal
        open={isCoinsModalOpen}
        onClose={handleCloseCoinsModal}
        role={role}
      />
    </div>
  );
}
