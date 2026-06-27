"use client";

import React, { useState } from "react";
import { Heart, Bookmark, Share } from "lucide-react";

export default function ExploreReelsView({ ads }) {
  // A simple vertical scrollable container for reels
  return (
    <div className="flex flex-col items-center w-full gap-8 mt-6">
      {ads.map((ad, index) => (
        <ReelCard key={ad.id || index} ad={ad} />
      ))}
    </div>
  );
}

function ReelCard({ ad }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(ad.isBookmarked || false);

  return (
    <div className="relative w-full max-w-4xl h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-sm group">
      {/* Background Image */}
      <img
        src={ad.imageUrl}
        alt="Reel"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Action Buttons (Right side) */}
      <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 flex flex-col gap-4 z-10">
        {/* Like */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <Heart size={22} className={isLiked ? "fill-primary text-primary" : "text-gray-600"} />
        </button>
        {/* Bookmark */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <Bookmark size={22} className={isBookmarked ? "fill-primary text-primary" : "text-gray-600"} />
        </button>
        {/* Share */}
        <button
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <Share size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex items-end justify-between z-10">
        <div className="flex items-center gap-4">
          <img
            src={ad.userAvatar}
            alt={ad.userName}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <div className="flex flex-col">
            <h3 className="text-white text-lg md:text-xl font-semibold">
              {ad.userName}
            </h3>
            <p className="text-white/90 text-sm md:text-base mt-0.5 line-clamp-1 max-w-[250px] md:max-w-sm">
              {ad.description}
            </p>
          </div>
        </div>

        <span className="text-white/90 text-sm font-medium">
          {ad.timeAgo}
        </span>
      </div>
    </div>
  );
}
