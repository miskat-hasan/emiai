import React from "react";
import Image from "next/image";

import { BookmarkSVG, BookmarkFilledSVG } from "@/components/common/Svg";

const AdCard = ({
  imageUrl,
  userName,
  userAvatar,
  description,
  timeAgo,
  isBookmarked = false,
  onClick,
  onBookmarkToggle,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer"
    >
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={description || "Ad"}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.75)_100%)]" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
        <div className="flex items-center gap-3 w-full">
          {/* User avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-white/30">
            <Image
              src={userAvatar}
              alt={userName}
              fill
              className="object-cover"
            />
          </div>

          {/* Text block taking remaining width */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            {/* Top row: username and bookmark */}
            <div className="flex justify-between items-center gap-2">
              <p className="text-white font-semibold text-sm leading-tight truncate">
                {userName}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle?.();
                }}
                className="flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkFilledSVG className="text-primary fill-primary" />
                ) : (
                  <BookmarkSVG className="text-white/40" />
                )}
              </button>
            </div>

            {/* Bottom row: description and time ago */}
            <div className="flex justify-between items-center gap-2">
              <p className="text-white/70 text-xs truncate">
                {description}
              </p>
              <span className="text-white/60 text-[11px] whitespace-nowrap shrink-0 mt-0.5">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdCard);
