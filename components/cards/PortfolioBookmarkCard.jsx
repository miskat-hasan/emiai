"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import Image from "next/image";
import { BookmarkFilledSVG, EyeSVG, HeartSVG } from "../common/Svg";

export default function PortfolioBookmarkCard({
  image,
  title = "Bike Ads Portfolio",
  details = "Hello this is about my portfolio",
  likes = "23k",
  views = "23k",
  bookmarked = true,
  onBookmark,
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E6E6] flex flex-col p-4 gap-2.5">
      {/* Thumbnail */}
      <div className="relative w-full aspect-[9/10] bg-gray-100 overflow-hidden rounded-lg">
        {/* {image ? ( */}
        <Image
          src={getImageUrl(
            image ??
            "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          )}
          alt={title}
          fill
          className="object-cover"
        />
        {/* ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )} */}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 pb-2">
        <span className="flex items-center gap-1 text-xs text-gray">
          <HeartSVG className="text-gray" />
          {likes}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray">
          <EyeSVG className="text-gray" />
          {views}
        </span>
        <button onClick={onBookmark} className="ml-auto" aria-label="Bookmark">
          <BookmarkFilledSVG
            className={
              bookmarked ? "fill-primary text-primary" : "text-gray-300"
            }
          />
        </button>
      </div>

      {/* Info rows */}
      <div className="divide-y divide-[#E5E6E6] bg-[#F7F7F7] rounded-xl">
        <div className="flex items-start gap-3 mx-2.5 py-2.5">
          <span className="text-xs text-gray w-12 shrink-0">Title</span>
          <span className="text-xs font-semibold text-black truncate">
            {title}
          </span>
        </div>
        <div className="flex items-start gap-3 mx-2.5 py-2.5">
          <span className="text-xs text-gray w-12 shrink-0">Details</span>
          <span className="text-xs text-black truncate">{details}</span>
        </div>
      </div>
    </div>
  );
}
