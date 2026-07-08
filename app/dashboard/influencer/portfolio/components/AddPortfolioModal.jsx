"use client";

import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { usePostPortfolioMutation, useGetMyClientsQuery } from "@/redux/api/services/portfolioApi";

export default function AddPortfolioModal({ open, onClose, onSubmitPortfolio, role }) {
  const user = useSelector((state) => state.auth?.user);
  const [postPortfolio, { isLoading: isSubmitting }] = usePostPortfolioMutation();
  const { data: clientsRes, isLoading: loadingClients } = useGetMyClientsQuery(undefined, {
    skip: !(role === "agency" || role === "business_manager"),
  });
  const influencers = clientsRes?.data || [];
  const [portfolioType, setPortfolioType] = useState("personal"); // "personal" | "influencer"

  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      portfolioTitle: "",
      portfolioDescription: "",
      selectedInfluencer: "",
      items: [{ photo: "", preview: "", details: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const showInfluencerSelect = role === "agency" || role === "business_manager";

  const handleClose = () => {
    reset();
    setPortfolioType("personal");
    onClose?.();
  };

  const handleFormSubmit = async (data) => {
    let userId;
    if (portfolioType === "influencer" && data.selectedInfluencer) {
      userId = data.selectedInfluencer;
    } else {
      userId = user?.id;
    }

    if (!userId) {
      toast.error("User not identified. Please try again.");
      return;
    }

    const mediaFiles = (data.items || [])
      .filter((item) => item.photo instanceof File)
      .map((item) => ({
        file: item.photo,
        title: item.details || "",
        media_type: item.photo.type.startsWith("video/") ? "video" : "photo",
      }));

    if (mediaFiles.length === 0) {
      toast.error("Please add at least one media file.");
      return;
    }

    try {
      const res = await postPortfolio({
        user_id: userId,
        title: data.portfolioTitle,
        description: data.portfolioDescription,
        mediaFiles,
      }).unwrap();

      if (res?.success || res?.code === 201 || res?.code === 200) {
        toast.success(res?.message || "Portfolio created successfully!");
        onSubmitPortfolio?.(data);
        handleClose();
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create portfolio.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-[600px] rounded-[22px] bg-white px-6 py-8 shadow-2xl sm:px-10 sm:py-10 overflow-y-auto max-h-[90vh]">
        <h2 className="mb-6 text-2xl font-bold text-[#202626]">Add New Portfolio</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Step 1: Portfolio Type selector - only for agency / business_manager */}
          {showInfluencerSelect && (
            <div className="mb-5">
              <label className="mb-3 block text-sm font-medium text-[#737D7A]">
                This portfolio is for
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPortfolioType("personal");
                    setValue("selectedInfluencer", "");
                  }}
                  className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${portfolioType === "personal"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-white text-[#737D7A] hover:border-gray-300"
                    }`}
                >
                  {/* <span className="block text-base">🙋</span> */}
                  <span className="block mt-1">Personal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioType("influencer")}
                  className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${portfolioType === "influencer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-white text-[#737D7A] hover:border-gray-300"
                    }`}
                >
                  {/* <span className="block text-base">🌟</span> */}
                  <span className="block mt-1">Influencer</span>
                </button>
              </div>

              {/* Influencer dropdown - only when "Influencer" is selected */}
              {portfolioType === "influencer" && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-[#737D7A]">
                    Select Influencer
                  </label>
                  <div className="relative">
                    <select
                      {...register("selectedInfluencer", { required: portfolioType === "influencer" ? "Please select an influencer" : false })}
                      className="w-full appearance-none rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#202626] outline-none focus:border-primary/40 cursor-pointer"
                    >
                      <option value="">Select from the list</option>
                      {loadingClients ? (
                        <option value="" disabled>Loading...</option>
                      ) : influencers.length === 0 ? (
                        <option value="" disabled>No influencers found</option>
                      ) : (
                        influencers.map((inf) => (
                          <option key={inf.id} value={inf.id}>
                            {inf.name}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Portfolio Title & Description */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#737D7A]">
              Portfolio Title
            </label>
            <input
              {...register("portfolioTitle", { required: true })}
              placeholder="Enter portfolio title"
              className="w-full rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#202626] outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[#737D7A]">
              Portfolio Description
            </label>
            <textarea
              {...register("portfolioDescription", { required: true })}
              placeholder="Describe your portfolio..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#202626] outline-none"
            />
          </div>

          {/* Multiple Photos with Details */}
          {fields.map((field, idx) => {
            const photoPreview = watch(`items.${idx}.preview`);
            return (
              <div key={field.id} className="mb-5 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#737D7A]">
                    Photo {idx + 1}
                  </label>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="cursor-pointer rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*,video/mp4"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      setValue(`items.${idx}.preview`, preview);
                      setValue(`items.${idx}.photo`, file);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#202626] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
                />

                {photoPreview && (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    width={560}
                    height={200}
                    className="mt-3 h-40 w-full rounded-lg object-contain object-center"
                  />
                )}

                <label className="mt-3 mb-2 block text-sm font-medium text-[#737D7A]">
                  Photo Details
                </label>
                <textarea
                  {...register(`items.${idx}.details`)}
                  placeholder="Describe this photo..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#202626] outline-none"
                />
              </div>
            );
          })}

          {/* Add Another Photo button */}
          <button
            type="button"
            onClick={() => append({ photo: "", preview: "", details: "" })}
            className="cursor-pointer w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-[#737D7A] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
          >
            + Add Another Photo
          </button>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer h-[38px] rounded-lg bg-gray-100 px-4 text-sm font-semibold text-[#202626] hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer h-[38px] rounded-lg bg-gradient-to-r from-primary to-secondary px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Add Portfolio"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}