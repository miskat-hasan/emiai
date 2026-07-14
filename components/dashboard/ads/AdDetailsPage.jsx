"use client";

import { useGetAdByIdQuery } from "@/redux/api/services/adApi";
import { setStep } from "@/redux/slices/adCreationSlice";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateAdFlow = dynamic(() => import("./CreateAdFlow"), { ssr: false });
const PostPreview = dynamic(() => import("./PostPreview"), { ssr: false });

import {
  AdActionButtons,
  AdDescription,
  AdDetailHero,
  AdInfoCard,
  AdTopRanking,
  AdUserBar,
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
  const step = useSelector((state) => state.adCreation.step);
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      rawAd,
      id: rawAd.id,
      imageUrl,
      mediaType,
      userName: rawAd.advertiser.name,
      userAvatar: rawAd.advertiser.avatar,
      likes: rawAd.likes_count || 0,
      views: rawAd.views_count || 0,
      is_bookmarked: rawAd.is_bookmarked || false,
      boostLabel: rawAd.is_boosted ? "Boost Credited" : null,
      description: [rawAd.description || ""],
      category_id: rawAd.category_id || "",
      publishAt: rawAd.publish_at || rawAd.created_at || null,
      info: [
        {
          label: "Ads Created By",
          value: rawAd.advertiser.name,
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
      <div className="space-y-5 animate-pulse">
        {/* Page heading skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[300px] md:h-[400px] bg-gray-200 rounded-[2rem]"></div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
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

  if (step === "preview") {
    return <PostPreview />;
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
          onEdit={
            isMyAd
              ? () => {
                  let safePublishAt = "";
                  if (ad.publishAt) {
                    try {
                      safePublishAt = new Date(ad.publishAt).toISOString().slice(0, 16);
                    } catch (e) {
                      safePublishAt = "";
                    }
                  }

                  let safeExpiryDate = "";
                  if (ad.rawAd.promo_code?.expiry_date) {
                    try {
                      safeExpiryDate = new Date(ad.rawAd.promo_code.expiry_date).toISOString().split("T")[0];
                    } catch (e) {
                      safeExpiryDate = "";
                    }
                  }

                  const prizes = ad.rawAd.prizes && ad.rawAd.prizes.length > 0 
                    ? ad.rawAd.prizes.map((p) => ({ rank: p.rank, value: p.prize_value }))
                    : [];

                  const prizeType = ad.rawAd.prizes && ad.rawAd.prizes.length > 0 
                    ? ad.rawAd.prizes[0].prize_type 
                    : (ad.rawAd.promo_code ? "coupon" : "cash");

                  const editData = {
                    id: ad.id,
                    description: ad.description[0] || "",
                    category_id: ad.category_id,
                    publishAt: safePublishAt,
                    imageUrl: ad.imageUrl,
                    countries: ad.rawAd.target_countries?.map((c) => c.country_code) || [],
                    prizeType,
                    prizes,
                    promoCode: ad.rawAd.promo_code?.code || "",
                    promoCodeDiscount: ad.rawAd.promo_code?.discount_percentage || "",
                    promoCodeExpiry: safeExpiryDate,
                  };
                  
                  setEditingAd(editData);
                  dispatch(setStep("create_ad"));
                }
              : undefined
          }
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
            userAvatar={
              ad.userAvatar === null
                ? "/images/avatar_placeholder.png"
                : ad.userAvatar
            }
            likes={ad.likes}
            views={ad.views}
            boostLabel={ad.boostLabel}
          />

          <hr className="border-gray-200" />

          <AdDescription description={ad.description} />

          <div className="md:w-1/2 mt-2">
            <AdTopRanking adId={ad.id} rankings={ad.topRankings?.length > 0 ? ad.topRankings : undefined} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <AdInfoCard items={ad.info} />
        </div>
      </div>

      {step !== "preview" && (
        <CreateAdFlow
          editingAd={editingAd}
          onCloseFlow={() => setEditingAd(null)}
        />
      )}
    </div>
  );
}
