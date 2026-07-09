"use client";

import React, { useState, useRef, useEffect } from "react";
import { Heart, Bookmark, Share2, VolumeX, Volume2 } from "lucide-react";
import { useStoreInteractionMutation } from "@/redux/api/services/interactionApi";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";

export default function ExploreReelsView({ ads }) {
  if (!ads || ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-200px)] bg-primary/5 rounded-3xl border border-dashed border-primary/20">
        <div className="text-gray-500 text-lg font-medium">
          No reels match your filters.
        </div>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your search or country filter.
        </p>
      </div>
    );
  }

  // A simple vertical scrollable container for reels
  return (
    <div className="flex flex-col items-center w-full h-[calc(100vh-200px)] overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-primary/10 rounded-3xl">
      {ads.map((ad, index) => (
        <ReelCard key={ad.id || index} ad={ad} />
      ))}
    </div>
  );
}

function ReelCard({ ad }) {
  const [isLiked, setIsLiked] = useState(ad.is_liked);
  const [isBookmarked, setIsBookmarked] = useState(ad.isBookmarked || false);
  
  useEffect(() => {
    setIsBookmarked(ad.isBookmarked || ad.is_bookmarked || false);
  }, [ad.isBookmarked, ad.is_bookmarked]);

  useEffect(() => {
    setIsLiked(ad.is_liked || false);
  }, [ad.is_liked]);

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hasViewedRef = useRef(false);
  const [storeInteraction] = useStoreInteractionMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const handleBookmarkToggle = async () => {
    setIsBookmarked(!isBookmarked);
    if (ad.id) {
      try {
        await toggleBookmark({ id: ad.id, type: "ad" }).unwrap();
      } catch (err) {
        setIsBookmarked(!isBookmarked);
      }
    }
  };

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
      { threshold: 0.6 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const isVideo =
    ad.mediaType === "video" ||
    ad.imageUrl?.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl shrink-0 h-full snap-center snap-always overflow-hidden shadow-sm group bg-primary/10"
    >
      {/* Background Media */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={ad.imageUrl}
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={ad.imageUrl}
          alt="Reel"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Sound Toggle */}
      {isVideo && (
        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Play/Pause Area */}
      {isVideo && (
        <div
          className="absolute inset-0 z-0 cursor-pointer"
          onClick={() => {
            if (videoRef.current?.paused) videoRef.current.play();
            else videoRef.current?.pause();
          }}
        />
      )}

      {/* Action Buttons (Right side) */}
      <div className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 flex flex-col gap-4 z-10 pointer-events-auto">
        {/* Like */}
        <button
          onClick={() => {
            setIsLiked(!isLiked);
            if (ad.id) {
              storeInteraction({
                target_id: ad.id,
                target_type: "ad",
                interaction_type: "like",
              }).catch(() => {});
            }
          }}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <Heart
            size={22}
            className={isLiked ? "fill-primary text-primary" : "text-gray-600"}
          />
        </button>
        {/* Bookmark */}
        <button
          onClick={handleBookmarkToggle}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <Bookmark
            size={22}
            className={
              isBookmarked ? "fill-primary text-primary" : "text-gray-600"
            }
          />
        </button>
        {/* Share */}
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
          <Share2 size={22} className="text-gray-600" />
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

        <span className="text-white/90 text-sm font-medium">{ad.timeAgo}</span>
      </div>
    </div>
  );
}
