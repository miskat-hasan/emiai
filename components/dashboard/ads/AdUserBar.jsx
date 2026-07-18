"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import React from "react";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";

export default function AdUserBar({
  userName,
  userAvatar,
  likes = 0,
  views = 0,
  boostLabel = "Boost Credited",
}) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-gray-200 bg-primary flex items-center justify-center text-white font-bold text-lg uppercase">
          {
            userAvatar && userAvatar !== "null" ? (
              <Image
                src={getImageUrl(userAvatar)}
                alt={userName}
                fill
                className="object-cover"
              />
            ) : (
              <span>{userName ? userName.charAt(0) : "?"}</span>
            )
          }
        </div>
        <span className="text-base font-semibold text-black">{userName}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray">
        {/* Likes */}
        <div className="flex items-center gap-1.5">
          <Heart size={16} className="text-red-500 fill-red-500" />
          <span className="font-medium text-red-500">{likes}</span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1.5">
          <Eye size={16} className="text-gray" />
          <span className="font-medium">{views}</span>
        </div>

        {/* Boost label */}
        {boostLabel && (
          <span className="text-gray font-medium">{boostLabel}</span>
        )}
      </div>
    </div>
  );
}
