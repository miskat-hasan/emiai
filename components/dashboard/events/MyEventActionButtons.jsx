"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, ScanLine, Share2, SquarePen, Trash2 } from "lucide-react";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";

export default function MyEventActionButtons({
  eventId,
  initialBookmarked,
  onCreateInvite,
  onJoin,
  onShare,
  onEdit,
  onDelete,
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked || false);
  }, [initialBookmarked]);

  const [toggleBookmark] = useToggleBookmarkMutation();

  const handleBookmarkToggle = async () => {
    setIsBookmarked((v) => !v);
    if (eventId) {
      try {
        await toggleBookmark({ id: eventId, type: "event" }).unwrap();
      } catch (err) {
        setIsBookmarked((v) => !v);
      }
    }
  };
  const handleJoinClick = () => {
    if (onJoin) onJoin();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Create Invite */}
        <button 
          onClick={onCreateInvite}
          className="px-5 py-2 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
        >
          Create Invite
        </button>
        {/* Check Ticket By Scan */}
        <button className="px-5 py-2 rounded-full bg-gradient-to-b from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer">
          Check Ticket By Scan
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmarkToggle}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
            isBookmarked
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

        {/* Edit */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 bg-gray/10 text-gray rounded-full hover:bg-gray/20 transition-colors cursor-pointer"
          >
            <SquarePen size={18} />
          </button>
        )}
      </div>
    </>
  );
}
