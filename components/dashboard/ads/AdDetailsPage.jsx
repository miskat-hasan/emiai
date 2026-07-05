"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setStep } from "@/redux/slices/adCreationSlice";
import { useGetAdByIdQuery } from "@/redux/api/services/adApi";
import dynamic from "next/dynamic";

const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });

import {
  AdDetailHero,
  AdUserBar,
  AdDescription,
  AdInfoCard,
  AdTopRanking,
  AdActionButtons,
} from "./index";

// Client Component
export default function AdDetailsPage({
  role,
  params,
  parentPath,
  parentName,
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const isMyAd = source === "my-ads";
  
  const dispatch = useDispatch();
  const [editingAd, setEditingAd] = useState(null);

  const { data: response, isLoading, isError } = useGetAdByIdQuery(id);

  const ad = useMemo(() => {
    let rawAd = null;
    if (response) {
      if (response.data?.data) rawAd = response.data.data;
      else if (response.data) rawAd = response.data;
      else rawAd = response;
    }

    if (!rawAd) return null;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team";
    const origin = new URL(apiUrl).origin;
    let imageUrl = rawAd.media_url;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${origin}${imageUrl}`;
    }

    let mediaType = rawAd.media_type;
    // Fallback and override for videos that might be incorrectly labeled as images
    if (imageUrl && imageUrl.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
      mediaType = "video";
    } else if (!mediaType && imageUrl) {
      mediaType = "image";
    }

    // Format date securely
    let publishDateStr = "N/A";
    let publishTimeStr = "N/A";
    if (rawAd.publish_at || rawAd.created_at) {
      const d = new Date(rawAd.publish_at || rawAd.created_at);
      if (!isNaN(d)) {
        publishDateStr = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        publishTimeStr = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    return {
      id: rawAd.id,
      imageUrl,
      mediaType,
      userName: "Advertiser " + (rawAd.advertiser_id || ""),
      userAvatar:
        "https://i.pravatar.cc/150?u=" + (rawAd.advertiser_id || rawAd.id),
      likes: rawAd.likes_count || 0,
      views: rawAd.views_count || 0,
      is_bookmarked: rawAd.is_bookmarked || false,
      boostLabel: rawAd.is_boosted ? "Boost Credited" : null,
      description: [rawAd.description || ""],
      category_id: rawAd.category_id || "",
      publishAt: rawAd.publish_at || rawAd.created_at || null,
      info: [
        {
          label: "Ads Create",
          value: "Advertiser " + (rawAd.advertiser_id || ""),
        },
        {
          label: "Prize Number",
          value: rawAd.prizes
            ? rawAd.prizes.length.toString().padStart(2, "0")
            : "00",
        },
        { label: "Publish Time", value: publishTimeStr },
        { label: "Publish Date", value: publishDateStr },
        ...(rawAd.promo_code
          ? [{ label: "Promo Code", value: rawAd.promo_code.code }]
          : []),
      ],
      topRankings: [], // No rankings data in the API currently
    };
  }, [response, role]);

  const backPath = parentPath || `/dashboard/${role}/ads`;
  const backName = parentName || "Ads";

  if (isLoading) {
    return (
      <div className="p-10 text-center animate-pulse">
        Loading ad details...
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load ad details.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">
            {backName === "Explore" ? "Ads" : "Ads"}
          </h1>
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
        <AdActionButtons 
          adId={ad.id} 
          initialBookmarked={ad.is_bookmarked} 
          isGuest={role === "guest"}
          onEdit={isMyAd ? () => {
            // Re-construct the rawAd equivalent object for CreateAdFlow
            const editData = {
              id: ad.id,
              description: ad.description[0] || "",
              category_id: ad.category_id,
              publishAt: ad.publishAt,
              imageUrl: ad.imageUrl,
            };
            setEditingAd(editData);
            dispatch(setStep("create_ad"));
          } : undefined}
        />
      </div>

      {/* Hero Image */}
      <AdDetailHero
        imageUrl={ad.imageUrl}
        mediaType={ad.mediaType}
        alt="Ad Banner"
      />

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

      <CreateAdFlow 
        editingAd={editingAd} 
        onCloseFlow={() => setEditingAd(null)} 
      />
    </div>
  );
}
