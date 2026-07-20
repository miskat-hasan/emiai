"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, Bookmark, Share2, Eye, VolumeX, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreInteractionMutation } from "@/redux/api/services/interactionApi";

export default function ExploreFeedCard({
  ad,
  onAdClick,
  onBookmarkToggle,
  onLikeToggle,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hasViewedRef = useRef(false);
  const [storeInteraction] = useStoreInteractionMutation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});

          if (!hasViewedRef.current && ad.id) {
            hasViewedRef.current = true;
            storeInteraction({
              target_id: ad.id,
              target_type: "ad",
              interaction_type: "view",
            }).catch(() => {});
          }
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ad.id, storeInteraction]);


  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const {
    id,
    imageUrl,
    mediaType,
    userName,
    userAvatar,
    description,
    createdAtFormatted,
    isBookmarked,
    is_liked,
  } = ad;

  // Render media
  const renderMedia = () => {
    if (mediaType === "video" || imageUrl?.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
      return (
        <div className="relative w-full aspect-[4/5] max-h-[65vh] bg-black overflow-hidden rounded-md mt-4 group">
          <video
            ref={videoRef}
            src={imageUrl}
            className="w-full h-full object-contain"
            loop
            muted={isMuted}
            playsInline
          />
          
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          {/* Play/Pause Area */}
          <div
            className="absolute inset-0 z-0 cursor-pointer"
            onClick={() => {
              if (videoRef.current?.paused) videoRef.current.play();
              else videoRef.current?.pause();
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] max-h-[65vh] bg-black overflow-hidden rounded-md mt-4">
        <Image
          src={imageUrl}
          alt={description || "Ad Media"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
        />
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col pt-6 pb-4 border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-primary flex items-center justify-center text-white font-bold text-lg uppercase">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="object-cover"
              />
            ) : (
              <span>{userName ? userName.charAt(0) : "?"}</span>
            )}
          </div>
          <span className="font-bold text-sm text-black">{userName}</span>
        </div>
        <span className="text-xs font-semibold text-black/70">
          {createdAtFormatted}
        </span>
      </div>

      {/* Description */}
      <div className="mt-4 text-[15px] leading-relaxed text-black/90">
        <p className={cn("whitespace-pre-wrap", !isExpanded && "line-clamp-3")}>
          {description}
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdClick?.(id);
          }}
          className="text-black font-bold text-[15px] underline mt-1 cursor-pointer"
        >
          See More
        </button>
      </div>

      {/* Media */}
      {imageUrl && renderMedia()}

      {/* Reactions Footer */}
      <div className="flex items-center gap-6 mt-4 pl-1">
        <button
          onClick={() => onLikeToggle?.(id)}
          className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
        >
          <Heart size={22} className={is_liked ? "fill-primary text-primary" : ""} />
        </button>
        
        <button
          onClick={() => onBookmarkToggle?.(id)}
          className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
        >
          <Bookmark size={22} className={isBookmarked ? "fill-primary text-primary" : ""} />
        </button>

        <button className="text-gray-500 hover:text-black transition-colors cursor-pointer">
          <Share2 size={22} />
        </button>

        <div className="flex items-center gap-2 text-gray-500 ml-auto">
          <Eye size={20} />
          <span className="text-sm font-medium underline">Boost Credited</span>
        </div>
      </div>
    </div>
  );
}
