"use client";

import React, { useState } from "react";
import { Bookmark, ScanLine, Share2 } from "lucide-react";

export default function AdActionButtons() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="flex items-center gap-2.5">
      {/* Bookmark */}
      <button
        onClick={() => setIsBookmarked(v => !v)}
        className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${isBookmarked
            ? "bg-gradient-to-r from-primary to-secondary text-white"
            : "bg-gray-100 text-gray hover:bg-gray-200"
          }`}
      >
        <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
      </button>

      {/* QR  */}
      <button className="p-2 bg-gray-100 text-gray rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <ScanLine size={18} />
      </button>

      {/* Share */}
      <button className="p-2 bg-gray-100 text-gray rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
        <Share2 size={18} />
      </button>
    </div>
  );
}
