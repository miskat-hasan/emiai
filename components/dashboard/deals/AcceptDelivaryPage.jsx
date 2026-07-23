"use client";

import { Headphones, Info, MessageSquare, Download, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { formatDate } from "@/helper/formatDate";
import { getImageUrl } from "@/helper/getImageUrl";
import {
  useUpdateDealStatusMutation,
  useRateDealMutation,
  useGetDealDeliveriesQuery,
} from "@/redux/api/services/dealApi";
import { toast } from "react-toastify";
import { RatingModal } from "./RatingModal";
import { useState } from "react";
import StatusBadge from "@/components/common/StatusBadge";

export default function AcceptDelivaryPage({
  role = "influencer",
  dealDetails,
  isOwner,
}) {
  const router = useRouter();
  const [updateDealStatus, { isLoading: isUpdating }] =
    useUpdateDealStatusMutation();
  const [rateDeal, { isLoading: isRating }] = useRateDealMutation();
  const deal = dealDetails?.data;
  
  const { data: deliveriesResponse, isLoading: isDeliveriesLoading } = useGetDealDeliveriesQuery(deal?.id, { skip: !deal?.id });
  const deliveryData = deliveriesResponse?.data?.deliveries?.[0] || deliveriesResponse?.data?.[0] || deliveriesResponse?.data;
  
  const ratingData = deliveriesResponse?.data?.ratings?.[0];
  const isRated = deliveriesResponse?.data?.is_rated;
  
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const handleUpdateStatus = async (status) => {
    try {
      await updateDealStatus({
        id: deal.id,
        status: status,
      }).unwrap();
      toast.success(
        `Delivery ${status === "completed" ? "accepted" : "cancelled"} successfully!`,
      );
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to update status",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ── */}
      <div>
        <h1 className="text-2xl font-bold text-black">Deals</h1>
        <p className="text-sm text-gray mt-0.5">
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/${role}`)}
          >
            Dashboard
          </span>
          {" / "}
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/${role}/deals`)}
          >
            Deals
          </span>
          {" / "}
          <span>Details</span>
        </p>
      </div>

      {/* ── Deal detail card ── */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden relative shadow-sm">
        {/* 95% Smart Match Badge */}
        <div className="absolute top-2 left-6">
          <div className="bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-bold px-4 py-1.5 rounded-xl shadow-sm">
            95% Smart Match
          </div>
        </div>

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 pt-12 border-b border-gray-100">
          <span className="text-base font-bold text-black">Statas</span>
          <div className="flex items-center gap-3">
            {/* Info icon */}
            <button
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
              title="Info"
            >
              <Info size={15} />
            </button>

            {/* Support icon */}
            <button
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors relative"
              title="Contact Support"
            >
              <Headphones size={15} />
              <span className="absolute -bottom-3 text-[9px] font-semibold text-gray-400">
                Support
              </span>
            </button>

            {/* Chat icon */}
            <button
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
              title="Chat"
            >
              <MessageSquare size={15} />
            </button>

            <StatusBadge status={deal?.status} className="ml-2" />
          </div>
        </div>

        {/* Person row */}
        <div className="flex items-center justify-between px-6 py-5 bg-gray-50/40 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary flex items-center justify-center text-white text-lg font-bold uppercase shadow-sm">
              {deal?.partner?.avatar ? (
                <Image
                  src={getImageUrl(deal.partner.avatar)}
                  alt={deal.partner.name || ""}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span>{deal?.partner?.name?.charAt(0) || "?"}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold text-black">
                {deal?.partner?.name}
              </span>
              <span className="text-xs text-gray mt-0.5 capitalize">
                {deal?.partner?.role}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-16">
            {deal?.duration && (
              <div className="text-right">
                <p className="text-xs text-black font-bold mb-1 uppercase tracking-wide">
                  Deal Duration
                </p>
                <p className="text-[13px] text-gray font-medium">
                  {deal.duration}
                </p>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-black font-bold mb-1 uppercase tracking-wide">
                Created At
              </p>
              <p className="text-[13px] text-gray font-medium">
                {formatDate(deal?.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Description + payout */}
        <div className="flex items-start justify-between gap-8 px-6 py-6 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            {isDeliveriesLoading ? (
              <div className="animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2.5"></div>
                <div className="h-4 w-full max-w-4xl bg-gray-200 rounded"></div>
              </div>
            ) : deliveryData?.message ? (
              <>
                <p className="text-[15px] font-bold text-black mb-2.5">
                  Delivery Message
                </p>
                <p className="text-[14px] text-gray leading-relaxed max-w-4xl whitespace-pre-wrap">
                  {deliveryData?.message}
                </p>
              </>
            ) : (
              <>
                <p className="text-[15px] font-bold text-black mb-2.5">
                  Delivary Message
                </p>
                <p className="text-[14px] text-gray leading-relaxed max-w-4xl whitespace-pre-wrap">
                  {deal?.message}
                </p>
              </>
            )}
          </div>
          <div className="text-right shrink-0 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <p className="text-[12px] font-bold text-gray uppercase tracking-widest mb-1.5">
              Net Payout
            </p>
            <p className="text-xl font-bold text-primary">
              {deal?.amount ? `$${deal.amount}` : "N/A"}
            </p>
          </div>
        </div>

        {/* Delivery Attachment */}
        {(deliveryData?.attachment || deal?.attachment) && (
          <div className="px-6 pb-8 pt-6">
            <div className="w-full h-[240px] md:h-[340px] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100 bg-gray-50 group">
              {/* Download Button */}
              <a
                href={getImageUrl(deliveryData?.attachment || deal?.attachment)}
                download
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 right-4 z-10 p-2.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition-all backdrop-blur-sm flex items-center justify-center opacity-100 cursor-pointer"
                title="Download Attachment"
              >
                <Download size={20} strokeWidth={2.5} />
              </a>

              {(deliveryData?.attachment || deal?.attachment).match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video
                  src={getImageUrl(deliveryData?.attachment || deal?.attachment)}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={getImageUrl(deliveryData?.attachment || deal?.attachment)}
                  alt="Delivery content"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions & Reviews */}
      <div className="py-1 px-2">
        {deal?.status === "completed" ? (
          <div className="w-full mt-4">
            {isOwner ? (
              !isRated ? (
                <div className="flex w-full justify-end">
                  <button
                    onClick={() => setIsRatingModalOpen(true)}
                    className="px-8 py-3 rounded-[14px] bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
                  >
                    Rate now
                  </button>
                </div>
              ) : (
                ratingData && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <span className="text-xl font-bold text-gray-500">{ratingData?.rating}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-bold text-black">Your Review</h3>
                          <span className="text-sm text-gray-400">{formatDate(ratingData?.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < ratingData?.rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-[14px] text-gray-600 leading-relaxed italic">"{ratingData?.message}"</p>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              // Not owner, but show the review they received if it's rated
              ratingData ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <span className="text-xl font-bold text-gray-500">{ratingData?.rating}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-black">Review from Client</h3>
                        <span className="text-sm text-gray-400">{formatDate(ratingData?.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < ratingData?.rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}
                          />
                        ))}
                      </div>
                        <p className="mt-3 text-[14px] text-gray-600 leading-relaxed italic">{ratingData?.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-4 px-2 mt-4 bg-gray-50 rounded-2xl border border-gray-100 w-full">
                  <p className="text-gray-600 font-medium text-sm">Deal is completed. Your Delivery Rating will appear here if the client rates your work.</p>
                </div>
              )
            )}
          </div>
        ) : (
          deal?.status === "delivered" && (
            isOwner ? (
              <div className="flex items-center justify-between w-full mt-4">
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus("rejected")}
                  className="text-[15px] font-medium text-red-500 hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  Cancel Delivery
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus("completed")}
                  className="px-8 py-3 rounded-[14px] bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Accept Delivery"}
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center py-4 px-2 mt-4 bg-gray-50 rounded-2xl border border-gray-100 w-full">
                <p className="text-gray-600 font-medium text-sm">Waiting for the deal owner to review and accept the delivery.</p>
              </div>
            )
          )
        )}
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        isLoading={isRating}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await rateDeal({
              deal_id: deal.id,
              rating: data.rating,
              message: data.message,
            }).unwrap();
            
            toast.success("Rating submitted successfully!");
            setIsRatingModalOpen(false);
          } catch (error) {
            console.error("Failed to submit rating", error);
            toast.error(
              error?.data?.message || error?.message || "Failed to submit rating"
            );
          }
        }}
      />
    </div>
  );
}
