"use client";

import MultiSelect from "@/components/ui/MultiSelect";
import { useCheckCouponPermissionMutation } from "@/redux/api/services/adApi";
import {
  useGetCategoriesQuery,
  useGetCountriesQuery,
} from "@/redux/api/services/commonApi";
import { setDraftData, setStep } from "@/redux/slices/adCreationSlice";
import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

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

import UploadBox from "@/components/ui/UploadBox";

const getOrdinalNumber = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Main modal

export default function CreateNewAdModal({
  open,
  onClose,
  onSuccess,
  editingAd,
}) {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.adCreation.draft);

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  const { data: countriesResponse } = useGetCountriesQuery();
  const countries = countriesResponse?.data || [];

  const [previewUrl, setPreviewUrl] = useState(draft.previewUrl || null);
  const [mediaFile, setMediaFile] = useState(draft.mediaFile || null);
  const [prizesCount, setPrizesCount] = useState(
    Math.max(1, draft.prizes?.length || 1),
  );

  const [checkCouponPermission, { isLoading: isCheckingCoupon }] =
    useCheckCouponPermissionMutation();

  const isLoading = isCheckingCoupon;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: draft,
  });

  const selectedCountries = watch("countries") || [];
  const prizeType = watch("prizeType");

  // Reset on close or when editingAd changes
  useEffect(() => {
    if (!open) {
      reset(draft);
      setMediaFile(draft.mediaFile || null);
      setPreviewUrl(draft.previewUrl || null);
      setPrizesCount(Math.max(1, draft.prizes?.length || 1));
    } else if (editingAd) {
      let rawPublishAt = editingAd.publishAt || "";
      
      // If the ad is already published, do not prefill the schedule time
      if (editingAd.status === "published") {
        rawPublishAt = "";
      }
      
      let pDate = "";
      let pTime = "";
      if (rawPublishAt) {
        const normalized = rawPublishAt.replace(" ", "T");
        const [d, t] = normalized.split("T");
        pDate = d || "";
        pTime = t ? t.substring(0, 5) : "";
      }

      reset({
        ...draft,
        id: editingAd.id,
        adsDescription: editingAd.description || "",
        adsCategory: editingAd.category_id || "",
        publishDate: pDate,
        publishTime: pTime,
        countries: editingAd.countries || [],
        prizeType: editingAd.prizeType || "cash",
        prizes: editingAd.prizes?.length
          ? editingAd.prizes
          : [{ rank: 1, value: "" }],
        promoCode: editingAd.promoCode || "",
        promoCodeDiscount: editingAd.promoCodeDiscount || "",
        promoCodeExpiry: editingAd.promoCodeExpiry || "",
      });
      if (editingAd.imageUrl) {
        setPreviewUrl(editingAd.imageUrl);
      }
      setPrizesCount(Math.max(1, editingAd.prizes?.length || 1));
    }
  }, [open, editingAd, reset, draft]);

  const removePrize = (indexToRemove) => {
    const currentPrizesCount = prizesCount;
    for (let i = indexToRemove; i < currentPrizesCount - 1; i++) {
      const nextValue = getValues(`prizes.${i + 1}.value`);
      setValue(`prizes.${i}.value`, nextValue || "");
    }
    setValue(`prizes.${currentPrizesCount - 1}.value`, "");
    setPrizesCount((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    if (data.prizeType === "coupon") {
      try {
        const fd = new FormData();
        const countriesList = data.countries || [];
        countriesList.forEach((c, idx) => {
          fd.append(`countries[${idx}]`, c);
        });
        const res = await checkCouponPermission(fd).unwrap();
        if (res?.data?.allowed === false) {
          setError("prizeType", {
            type: "manual",
            message:
              res.data.reason ||
              "You need system permission to create coupon prizes.",
          });
          return;
        }
      } catch (err) {
        setError("prizeType", {
          type: "manual",
          message:
            err?.data?.reason ||
            err?.data?.message ||
            err?.message ||
            "Coupon permission denied",
        });
        return;
      }
    }

    // Save draft and move to next step
    let combinedPublishAt = "";
    if (data.publishDate && data.publishTime) {
      combinedPublishAt = `${data.publishDate}T${data.publishTime}`;
    } else if (data.publishDate) {
      combinedPublishAt = `${data.publishDate}T00:00`;
    }

    const dataToSave = { ...data, publishAt: combinedPublishAt, mediaFile, previewUrl, id: editingAd?.id };
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
          <h2 className="text-base font-bold text-black">
            {editingAd ? "Edit Ad" : "Create New Ads"}
          </h2>
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
          <Field
            label="Ads Description *"
            error={errors.adsDescription?.message}
          >
            <Textarea
              rows={4}
              placeholder="Write Ads Description here..."
              {...register("adsDescription", {
                required: "Ads Description is required",
              })}
              className={errors.adsDescription ? "border-red-500" : ""}
            />
          </Field>

          {/* Ads Category */}
          <Field label="Ads Category *" error={errors.adsCategory?.message}>
            <div className="relative">
              <select
                defaultValue=""
                {...register("adsCategory", {
                  required: "Ads Category is required",
                })}
                className={`w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer ${errors.adsCategory ? "border-red-500" : ""}`}
              >
                <option value="" disabled hidden>
                  Choose Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray text-xs"
              />
            </div>
          </Field>

          {/* Publish Date and Time */}
          <div className="flex gap-4">
            <Field label="Schedule Date (Optional)" className="flex-1">
              <Input type="date" {...register("publishDate")} />
            </Field>
            <Field label="Schedule Time (Optional)" className="flex-1">
              <Input type="time" {...register("publishTime")} />
            </Field>
          </div>

          {/* Location / Countries */}
          <Controller
            name="countries"
            control={control}
            rules={{ required: "At least one country is required" }}
            render={({ field }) => (
              <MultiSelect
                id="countries"
                label="Countries *"
                placeholder="Select Countries"
                options={countries.map((c) => ({ ...c, id: c.code }))}
                value={field.value || []}
                onChange={field.onChange}
                error={errors.countries?.message}
              />
            )}
          />

          {/* Prize Type */}
          <Field label="Prize Type" error={errors.prizeType?.message}>
            <div className="relative">
              <select
                defaultValue=""
                {...register("prizeType")}
                className="w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled hidden>
                  Choose Prize Type
                </option>
                <option value="cash">Cash</option>
                <option value="coupon">Coupon</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray text-xs"
              />
            </div>
          </Field>

          {/* Dynamic Prizes */}
          {Array.from({ length: prizesCount }).map((_, index) => (
            <Field
              key={index}
              label={`${getOrdinalNumber(index + 1)} Prize`}
              error={errors?.prizes?.[index]?.value?.message}
            >
              <div className="flex gap-3 items-center">
                <input
                  type="hidden"
                  value={index + 1}
                  {...register(`prizes.${index}.rank`)}
                />
                <Input
                  type={prizeType === "cash" ? "number" : "text"}
                  min={prizeType === "cash" ? "0" : undefined}
                  step={prizeType === "cash" ? "any" : undefined}
                  placeholder={
                    prizeType === "cash"
                      ? "Write prize amount..."
                      : "Write prize title..."
                  }
                  {...register(`prizes.${index}.value`, {
                    required: "Prize is required",
                    validate: (val) => {
                      if (prizeType === "cash" && Number(val) <= 0) {
                        return "Must be a positive number";
                      }
                      return true;
                    },
                  })}
                  className={
                    errors?.prizes?.[index]?.value ? "border-red-500" : ""
                  }
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePrize(index)}
                    className="shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm"
                  >
                    <Minus size={20} />
                  </button>
                )}
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

          {/* Promo Code Fields */}
          <>
            {/* Create Promo Code */}
            <Field label="Create Promo Code" error={errors.promoCode?.message}>
              <Input
                placeholder="Write Promo Code here..."
                {...register("promoCode")}
                className={errors.promoCode ? "border-red-500" : ""}
              />
            </Field>

            {/* Promo Code Discount & Expiry */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Discount Percentage (%)">
                <Input
                  type="number"
                  placeholder="e.g. 10"
                  {...register("promoCodeDiscount")}
                />
              </Field>
              <Field label="Expiry Date">
                <Input type="date" {...register("promoCodeExpiry")} />
              </Field>
            </div>
          </>

          {/* Photo/Video */}
          <UploadBox
            label="Photo/Video"
            accept="image/png,image/jpeg,video/mp4"
            hint="PNG, JPG or MP4"
            file={mediaFile}
            previewUrl={previewUrl}
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
            onRemove={() => {
              setMediaFile(null);
              setValue("media", null);
              setPreviewUrl(null);
            }}
            mediaType={
              mediaFile?.type ||
              (mediaFile?.name?.match(/\.(mp4|webm|mov|ogg)$/i)
                ? "video/mp4"
                : undefined)
            }
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
