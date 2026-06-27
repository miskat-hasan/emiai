"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Upload, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setDraftData, setStep } from "@/redux/slices/adCreationSlice";

// Sub-components

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const Input = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all ${className}`}
    />
  );
});
Input.displayName = "Input";

const Textarea = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none ${className}`}
    />
  );
});
Textarea.displayName = "Textarea";

function UploadBox({ label, accept, hint, onChange, fileName, previewUrl }) {
  const ref = useRef(null);
  return (
    <Field label={label}>
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all"
      >
        <Upload size={18} className="text-primary shrink-0" />
        <div className="text-sm">
          {fileName ? (
            <span className="font-medium text-black">{fileName}</span>
          ) : (
            <>
              <span className="font-semibold text-primary underline underline-offset-2">
                Click to Upload
              </span>
              <span className="text-gray"> or drag & drop</span>
            </>
          )}
          {!fileName && <p className="text-xs text-gray mt-0.5">{hint}</p>}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onChange(file);
        }}
      />
      {previewUrl && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden mt-3">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}
    </Field>
  );
}

const getOrdinalNumber = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Main modal

export default function CreateNewAdModal({ open, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.adCreation.draft);

  const [previewUrl, setPreviewUrl] = useState(draft.previewUrl || null);
  const [mediaFile, setMediaFile] = useState(draft.mediaFile || null);
  const [prizesCount, setPrizesCount] = useState(Math.max(1, draft.prizes?.length || 1));
  const isLoading = false;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: draft,
  });

  // Reset on close
  useEffect(() => {
    if (!open) {
      reset(draft);
      setMediaFile(draft.mediaFile || null);
      setPreviewUrl(draft.previewUrl || null);
      setPrizesCount(Math.max(1, draft.prizes?.length || 1));
    }
  }, [open, reset, draft]);

  const onSubmit = async (data) => {
    // Save draft and move to next step
    const dataToSave = { ...data, mediaFile, previewUrl };
    dispatch(setDraftData(dataToSave));

    if (onSuccess) {
      onSuccess(dataToSave);
    } else {
      dispatch(setStep("post_options"));
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-black">Create New Ads</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 flex flex-col gap-5"
        >
          {/* Ads Description */}
          <Field label="Ads Description *" error={errors.adsDescription?.message}>
            <Input
              placeholder="Write Ads Description here..."
              {...register("adsDescription", { required: "Ads Description is required" })}
              className={errors.adsDescription ? "border-red-500" : ""}
            />
          </Field>

          {/* Ads Category */}
          <Field label="Ads Category *" error={errors.adsCategory?.message}>
            <Input
              placeholder="Write Ads Category here..."
              {...register("adsCategory", { required: "Ads Category is required" })}
              className={errors.adsCategory ? "border-red-500" : ""}
            />
          </Field>

          {/* Location */}
          <Field label="Location *" error={errors.location?.message}>
            <Input
              placeholder="Write Location here..."
              {...register("location", { required: "Location is required" })}
              className={errors.location ? "border-red-500" : ""}
            />
          </Field>

          {/* Prize Type */}
          <Field label="Prize Type">
            <div className="relative">
              <select
                defaultValue=""
                {...register("prizeType")}
                className="w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Choose Prize Type
                </option>
                <option value="money">Money</option>
                <option value="gift">Gift</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray text-xs"
              />
            </div>
          </Field>

          {/* Dynamic Prizes */}
          {Array.from({ length: prizesCount }).map((_, index) => (
            <Field key={index} label={`${getOrdinalNumber(index + 1)} Prize`}>
              <div className="flex gap-3 items-center">
                <Input
                  placeholder="Write prize value..."
                  {...register(`prizes.${index}`)}
                />
                {index === prizesCount - 1 && (
                  <button
                    type="button"
                    onClick={() => setPrizesCount((prev) => prev + 1)}
                    className="shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer shadow-sm shadow-primary/20"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            </Field>
          ))}

          {/* Create Promo Code */}
          <Field label="Create Promo Code">
            <Input
              placeholder="Write Promo Code here..."
              {...register("promoCode")}
            />
          </Field>

          {/* Promo Code Details */}
          <Field label="Promo Code Details">
            <Textarea
              placeholder="Write promo code details here..."
              rows={3}
              {...register("promoCodeDetails")}
            />
          </Field>

          {/* Publish Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Publish Date">
              <Input
                type="date"
                {...register("publishDate")}
              />
            </Field>
            <Field label="Publish Time">
              <Input
                type="time"
                {...register("publishTime")}
              />
            </Field>
          </div>

          {/* Photo/Video */}
          <UploadBox
            label="Photo/Video"
            accept="image/png,image/jpeg,video/mp4"
            hint="PNG, JPG or MP4"
            onChange={(file) => {
              if (file) {
                setMediaFile(file);
                setValue("media", file);
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setMediaFile(null);
                setValue("media", null);
                setPreviewUrl(null);
              }
            }}
            fileName={mediaFile?.name}
            previewUrl={previewUrl}
          />

          {/* Footer: Cancel | Publish Ads */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              {isLoading ? "Publishing..." : "Publish Ads"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
