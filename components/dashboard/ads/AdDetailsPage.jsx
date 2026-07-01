"use client";

import React, { use, useMemo } from "react";
import Link from "next/link";
import { useGetAdByIdQuery } from "@/redux/api/services/adApi";
import {
  AdDetailHero,
  AdUserBar,
  AdDescription,
  AdInfoCard,
  AdTopRanking,
  AdActionButtons,
} from "./index";

// Client Component
export default function AdDetailsPage({ role, params, parentPath, parentName }) {
  const { id } = use(params);
  const { data: response, isLoading, isError } = useGetAdByIdQuery(id);

  const ad = useMemo(() => {
    let rawAd = null;
    if (response) {
      if (response.data?.data) rawAd = response.data.data;
      else if (response.data) rawAd = response.data;
      else rawAd = response;
    }

    if (!rawAd) return null;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team";
    const origin = new URL(apiUrl).origin;
    let imageUrl = rawAd.media_url;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${origin}${imageUrl}`;
    }
    let mediaType = rawAd.media_type;

    if (!mediaType && imageUrl) {
      if (imageUrl.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
        mediaType = "video";
      } else {
        mediaType = "image";
      }
    }

    // Format date securely
    let publishDateStr = "N/A";
    let publishTimeStr = "N/A";
    if (rawAd.publish_at || rawAd.created_at) {
      const d = new Date(rawAd.publish_at || rawAd.created_at);
      if (!isNaN(d)) {
        publishDateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        publishTimeStr = d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
      }
    }

    return {
      id: rawAd.id,
      imageUrl,
      mediaType,
      userName: "Advertiser " + (rawAd.advertiser_id || ""),
      userAvatar: "https://i.pravatar.cc/150?u=" + (rawAd.advertiser_id || rawAd.id),
      likes: rawAd.likes || 0,
      views: rawAd.views || 0,
      boostLabel: rawAd.is_boosted ? "Boost Credited" : null,
      description: [rawAd.description || ""],
      info: [
        { label: "Ads Create", value: "Advertiser " + (rawAd.advertiser_id || "") },
        { label: "Prize Number", value: rawAd.prizes ? rawAd.prizes.length.toString().padStart(2, '0') : "00" },
        { label: "Publish Time", value: publishTimeStr },
        { label: "Publish Date", value: publishDateStr },
      ],
      topRankings: [], // No rankings data in the API currently
    };
  }, [response, role]);

  const backPath = parentPath || `/dashboard/${role}/ads`;
  const backName = parentName || "Ads";

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse">Loading ad details...</div>;
  }

  if (isError || !ad) {
    return <div className="p-10 text-center text-red-500">Failed to load ad details.</div>;
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">{backName === "Explore" ? "Ads" : "Ads"}</h1>
          <p className="text-sm text-gray mt-0.5">
            <Link
              href={`/dashboard/${role}`}
              className="text-primary font-medium hover:underline"
            >
              Dashboard
            </Link>
            {" / "}
            <Link
              href={backPath}
              className="text-primary font-medium hover:underline"
            >
              {backName}
            </Link>
            {" / "}
            <span>Ads Details</span>
          </p>
        </div>

        {/* Action Buttons */}
        <AdActionButtons />
      </div>

      {/* Hero Image */}
      <AdDetailHero imageUrl={ad.imageUrl} mediaType={ad.mediaType} alt="Ad Banner" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <AdUserBar
            userName={ad.userName}
            userAvatar={ad.userAvatar}
            likes={ad.likes}
            views={ad.views}
            boostLabel={ad.boostLabel}
          />
          
          <hr className="border-gray-200" />
          
          <AdDescription description={ad.description} />
          
          {ad.topRankings && ad.topRankings.length > 0 && (
            <div className="md:w-1/2">
              <AdTopRanking rankings={ad.topRankings} />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <AdInfoCard items={ad.info} />
        </div>
      </div>
    </div>
  );
}
