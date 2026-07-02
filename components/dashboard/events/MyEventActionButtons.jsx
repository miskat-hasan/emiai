"use client";

import React, { useState } from "react";
import { Bookmark, ScanLine, Share2 } from "lucide-react";
import BuyTicketModal from "./BuyTicketModal";

export default function MyEventActionButtons({ onJoin }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinClick = () => {
    if (onJoin) onJoin();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Bookmark */}
        <button
          onClick={() => setIsBookmarked(v => !v)}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${isBookmarked
              ? "bg-gradient-to-b from-primary to-secondary text-white"
              : "bg-gray/10 text-gray hover:bg-gray/20"
            }`}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>

        {/* QR / Scan */}
        <button className="p-2 bg-gray/10 text-gray rounded-full hover:bg-gray/20 transition-colors cursor-pointer">
          <ScanLine size={18} />
        </button>

        {/* Share */}
        <button className="p-2 bg-gray/10 text-gray rounded-full hover:bg-gray/20 transition-colors cursor-pointer">
          <Share2 size={18} />
        </button>

        {/* Join The Event */}
        <button
          onClick={handleJoinClick}
          className="px-5 py-2 rounded-full bg-gradient-to-b from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
        >
          Join The Event
        </button>
      </div>

      <BuyTicketModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
