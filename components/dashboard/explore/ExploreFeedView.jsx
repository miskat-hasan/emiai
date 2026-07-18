import React from "react";
import ExploreFeedCard from "./ExploreFeedCard";

export default function ExploreFeedView({ ads, onAdClick, onBookmarkToggle, onLikeToggle }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">No ads found</p>
        <p className="text-sm mt-1 text-gray/70">
          Published ads will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {ads.map((ad) => (
        <ExploreFeedCard
          key={ad.id}
          ad={ad}
          onAdClick={onAdClick}
          onBookmarkToggle={onBookmarkToggle}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}
