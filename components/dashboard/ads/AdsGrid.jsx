import React, { memo } from "react";
import AdCard from "./AdCard";

const AdsGrid = memo(function AdsGrid({ ads, activeTab, onAdClick, onBookmarkToggle, onEditClick }) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {ads.map(ad => (
        <AdCard
          key={ad.id}
          imageUrl={ad.imageUrl}
          mediaType={ad.mediaType}
          userName={ad.userName}
          userAvatar={ad.userAvatar}
          description={ad.description}
          timeAgo={ad.timeAgo}
          isBookmarked={ad.isBookmarked}
          status={ad.status}
          publishAt={ad.publishAt}
          tabType={activeTab}
          onClick={() => onAdClick?.(ad.id)}
          onBookmarkToggle={() => onBookmarkToggle?.(ad.id)}
          onEditClick={onEditClick ? () => onEditClick(ad) : undefined}
        />
      ))}
    </div>
  );
});

export default AdsGrid;
