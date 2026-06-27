import React, { memo } from "react";
import AdCard from "./AdCard";

const AdsGrid = memo(function AdsGrid({ ads, onAdClick, onBookmarkToggle }) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {ads.map(ad => (
        <AdCard
          key={ad.id}
          imageUrl={ad.imageUrl}
          userName={ad.userName}
          userAvatar={ad.userAvatar}
          description={ad.description}
          timeAgo={ad.timeAgo}
          isBookmarked={ad.isBookmarked}
          onClick={() => onAdClick?.(ad.id)}
          onBookmarkToggle={() => onBookmarkToggle?.(ad.id)}
        />
      ))}
    </div>
  );
});

export default AdsGrid;
