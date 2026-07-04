"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, ScanLine, Share2, Trash2, Edit } from "lucide-react";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";

export default function AdActionButtons({ adId, initialBookmarked, onEdit, onDelete }) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false);
  
  useEffect(() => {
    setIsBookmarked(initialBookmarked || false);
  }, [initialBookmarked]);

  const [toggleBookmark] = useToggleBookmarkMutation();

  const handleBookmarkToggle = async () => {
    setIsBookmarked(v => !v);
    if (adId) {
      try {
        await toggleBookmark({ id: adId, type: 'ad' }).unwrap();
      } catch (err) {
        setIsBookmarked(v => !v);
      }
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* Bookmark */}
      <button
        onClick={handleBookmarkToggle}
        className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
          isBookmarked
            ? "bg-gradient-to-r from-primary to-secondary text-white"
            : "bg-gray-100 text-gray hover:bg-gray-200"
        }`}
      >
        <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
      </button>

      {/* QR / Scan */}
      <button className="p-2 bg-gray-100 text-gray rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <ScanLine size={18} />
      </button>

      {/* Share */}
      <button className="p-2 bg-gray-100 text-gray rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <Share2 size={18} />
      </button>

      {/* Delete */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 bg-gray-100 text-gray rounded-full hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Edit */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 bg-gray-100 text-gray rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Edit size={18} />
        </button>
      )}
    </div>
  );
}
