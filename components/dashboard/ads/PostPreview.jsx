"use client";

import React from "react";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setStep, clearDraft } from "@/redux/slices/adCreationSlice";
import { useCreateAdMutation } from "@/redux/api/services/adApi";
import { toast } from "react-toastify";

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

export default function PostPreview() {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.adCreation.draft);
  const options = useSelector((state) => state.adCreation.options);
  const [createAd, { isLoading }] = useCreateAdMutation();

  const handleBack = () => {
    dispatch(setStep("create_ad"));
  };

  const handlePublish = async () => {
    const fd = new FormData();
    fd.append("adsDescription", draft.adsDescription);
    fd.append("adsCategory", draft.adsCategory);
    fd.append("location", draft.location);
    fd.append("prizeType", draft.prizeType);
    fd.append("prizes", JSON.stringify(draft.prizes));
    fd.append("promoCode", draft.promoCode);
    fd.append("promoCodeDetails", draft.promoCodeDetails);
    fd.append("publishDate", draft.publishDate);
    fd.append("publishTime", draft.publishTime);
    fd.append("paymentOption", options.selectedOption);
    if (options.code) fd.append("paymentCode", options.code);
    if (draft.mediaFile) fd.append("media", draft.mediaFile);

    try {
      // await createAd(fd).unwrap();
      toast.success("Ads published successfully!");
      dispatch(clearDraft());
    } catch (err) {
      toast.error("Failed to publish ads.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <h1 className="text-[22px] font-bold text-black">Post Privew</h1>

      {/* Main Image */}
      <div className="relative w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden shadow-sm">
        {draft.previewUrl ? (
          <Image src={draft.previewUrl} alt="Ad Preview" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <Image src="/images/placeholder.png" alt="No image" width={100} height={100} className="opacity-20" />
            <span className="mt-4">No Image Uploaded</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: User & Description */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden relative">
                <Image src="https://i.pravatar.cc/150?u=jane" alt="User" fill className="object-cover" />
              </div>
              <h3 className="font-bold text-black text-lg">Jane Smith</h3>
            </div>

            <div className="flex items-center gap-5 text-sm text-gray font-medium">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Heart size={20} fill="currentColor" /> 24
              </div>
              <div className="flex items-center gap-2">
                <Eye size={20} /> 24
              </div>
              <span className="underline underline-offset-2 cursor-pointer ml-2">Boost Credited</span>
            </div>
          </div>

          <div className="text-sm text-black leading-[1.8] whitespace-pre-wrap">
            {draft.adsDescription || "Step into a night of unparalleled elegance at the Black Diamond Ball, a collaboration between Lumina Moda and renowned designer, Seraphina Dubois!\n\nExperience an evening where fashion transcends artistry, with a showcase of exclusive designs and breathtaking displays."}
          </div>
        </div>

        {/* Right Side: Ads Information */}
        <div className="w-full md:w-[380px] shrink-0 bg-[#fff6f0] rounded-[2rem] p-7 h-fit">
          <h3 className="font-bold text-black mb-6">Ads Information</h3>

          <div className="flex flex-col gap-5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ads Create</span>
              <span className="font-semibold text-black">Jane Smith</span>
            </div>
            <div className="w-full h-[1px] bg-gray-200" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Prize Number</span>
              <span className="font-semibold text-black">
                {String(draft.prizes?.length || 0).padStart(2, "0")}
              </span>
            </div>
            <div className="w-full h-[1px] bg-gray-200" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Publish Time</span>
              <span className="font-semibold text-black">
                {draft.publishTime ? formatTime(draft.publishTime) : "11:59 PM"}
              </span>
            </div>
            <div className="w-full h-[1px] bg-gray-200" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Publish Date</span>
              <span className="font-semibold text-black">
                {draft.publishDate ? formatDate(draft.publishDate) : "Feb 15, 2026"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-10">
        <button
          onClick={handleBack}
          className="font-bold text-sm hover:opacity-80 hover:cursor-pointer transition-opacity"
        >
          Back
        </button>

        <button
          onClick={handlePublish}
          disabled={isLoading}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 hover:cursor-pointer transition-all shadow-md disabled:opacity-60"
        >
          {isLoading ? "Publishing..." : "Publish Ads"}
        </button>
      </div>
    </div>
  );
}
