"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, ScanLine, Share2, SquarePen } from "lucide-react";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";

export default function EventActionButtons({
  eventId,
  initialBookmarked,
  onCreateInvite,
  onCheckTicketByScan,
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false);
  
  useEffect(() => {
    setIsBookmarked(initialBookmarked || false);
  }, [initialBookmarked]);
  const [toggleBookmark] = useToggleBookmarkMutation();

  const handleBookmarkToggle = async () => {
    setIsBookmarked(v => !v);
    if (eventId) {
      try {
        await toggleBookmark({ id: eventId, type: "event" }).unwrap();
      } catch (err) {
        setIsBookmarked(v => !v);
      }
    }
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Create Invite */}
      <button
        onClick={onCreateInvite}
        className="px-5 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer"
      >
        Create invite
      </button>

      {/* Check In */}
      <button
        onClick={onCheckTicketByScan}
        className="px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
      >
        Check ticket by scan
      </button>

      {/* Bookmark */}
      <button
        onClick={handleBookmarkToggle}
        className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer ${isBookmarked
            ? "bg-primary text-white"
            : "bg-[#F0F2F5] text-[#63716E] hover:bg-gray-200"
          }`}
      >
        <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
      </button>

      {/* QR / Scan */}
      <button className="p-2.5 bg-[#F0F2F5] text-[#63716E] rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <ScanLine size={18} />
      </button>

      {/* Share */}
      <button className="p-2.5 bg-[#F0F2F5] text-[#63716E] rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <Share2 size={18} />
      </button>

      {/* Edit */}
      <button className="p-2.5 bg-[#F0F2F5] text-[#63716E] rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <SquarePen size={18} />
      </button>
    </div>
  );
}
