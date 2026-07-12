"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import Image from "next/image";
import { BookmarkSVG } from "../common/Svg";

export default function EventBookmarkCard({
  image,
  title,
  description,
  organizer,
  date,
  bookmarked = true,
  onBookmark,
}) {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-[11/12] group">
      {/* Background image */}
      {/* {image ? ( */}
      <Image
        src={getImageUrl(
          image ??
          "https://images.unsplash.com/photo-1670028514318-0ac718c0590d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        )}
        alt={title}
        fill
        className="object-cover"
      />
      {/* ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
      )} */}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.3)_76.74%,rgba(0,0,0,0.6)_85.44%,#000_100%)]" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-2.5 z-10">
        <div className="flex justify-between">
          <p className="text-white font-semibold text-sm lg:text-base leading-tight mb-1">
            {title}
          </p>
          {/* Bookmark button */}
          <button onClick={onBookmark} aria-label="Bookmark">
            <BookmarkSVG
              className={
                bookmarked ? "fill-primary text-primary" : "text-white"
              }
            />
          </button>
        </div>
        <p className="text-white/80 text-xs mb-2 line-clamp-1">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs">{organizer}</span>
          <span className="text-white/70 text-xs">{date}</span>
        </div>
      </div>
    </div>
  );
}
