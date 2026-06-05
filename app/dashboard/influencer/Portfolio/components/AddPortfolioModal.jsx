"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";

export default function AddPortfolioModal({ open, onClose, onSubmitPortfolio }) {
  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      portfolioTitle: "",
      description: "",
      items: [{ photo: "", preview: "", title: "", details: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleFormSubmit = (data) => {
    console.log("Portfolio submitted:", data);
    onSubmitPortfolio?.(data);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-[600px] rounded-[22px] bg-white px-6 py-8 shadow-2xl sm:px-10 sm:py-10 overflow-y-auto max-h-[90vh]">
        <h2 className="mb-6 text-2xl font-bold text-[#202626]">Add New Portfolio</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
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

          {fields.map((field, idx) => {
            // use idx instead of index
            const photoPreview = watch(`items.${idx}.preview`);
            return (
              <div key={field.id} className="mb-6 border-b border-gray-200 pb-4">
                <label className="mb-2 block text-sm font-medium text-[#737D7A]">
                  Portfolio Photo / Video
                </label>
                <input
                  type="file"
                  accept="image/*,video/mp4"
                  {...register(`items.${idx}.photo`)}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const preview = URL.createObjectURL(file);
                      setValue(`items.${idx}.preview`, preview);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#202626]"
                />

                {photoPreview && (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    className="mt-3 h-36 w-full rounded-lg object-cover"
                  />
                )}

                <label className="mt-3 mb-2 block text-sm font-medium text-[#737D7A]">
                  Title / Details
                </label>
                <input
                  {...register(`items.${idx}.title`)}
                  placeholder="Title"
                  className="w-full rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#202626]"
                />
                <input
                  {...register(`items.${idx}.details`)}
                  placeholder="Details"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#202626]"
                />

                <div className="mt-2 flex justify-end gap-2">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="rounded-lg bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  )}
                  {idx === fields.length - 1 && (
                    <button
                      type="button"
                      onClick={() => append({ photo: "", preview: "", title: "", details: "" })}
                      className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-600 hover:bg-green-200"
                    >
                      Add Another
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-[38px] rounded-lg bg-gray-100 px-4 text-sm font-semibold text-[#202626] hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[38px] rounded-lg bg-gradient-to-r from-primary to-secondary px-4 text-sm font-semibold text-white hover:opacity-90"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}