import React from "react";
import Image from "next/image";
import { BookmarkSVG, BookmarkFilledSVG } from "@/components/common/Svg";
import CountdownTimer from "@/components/common/CountdownTimer";

const AdCard = ({
  imageUrl,
  mediaType,
  userName,
  userAvatar,
  description,
  timeAgo,
  isBookmarked = false,
  status,
  publishAt,
  tabType,
  onClick,
  onBookmarkToggle,
  onEditClick,
}) => {
  const preventAction = status === "scheduled" && tabType === "all-ads";

  return (
    <div
      onClick={preventAction ? undefined : onClick}
      className={`relative rounded-2xl overflow-hidden aspect-[4/5] group ${
        preventAction ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {/* Edit button */}
      {onEditClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-sm"
          title="Edit Ad"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.376 3.622a2.12 2.12 0 1 1 2.998 2.999L7.382 18.61a4.5 4.5 0 0 1-1.742 1.054l-3.554 1.18a.33.33 0 0 1-.417-.416l1.18-3.554a4.5 4.5 0 0 1 1.054-1.742L16.376 3.622z" />
          </svg>
        </button>
      )}

      {/* Floating Countdown for Scheduled Ads */}
      {status === "scheduled" && publishAt && (
        <CountdownTimer targetDate={publishAt} />
      )}

      {/* Background image or video */}
      {mediaType === "video" || imageUrl?.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) ? (
        <video
          src={status === "scheduled" ? `${imageUrl}#t=1.0` : imageUrl}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          muted
          loop
          autoPlay={status !== "scheduled"}
          playsInline
        />
      ) : (
        <Image
          src={imageUrl}
          alt={description || "Ad"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.75)_100%)]" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
        <div className="flex items-center gap-3 w-full">
          {/* User avatar */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-white/30">
            <Image
              src={process.env.NEXT_PUBLIC_API_URL + "/" + userAvatar}
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
              <p className="text-white/70 text-xs truncate">{description}</p>
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
