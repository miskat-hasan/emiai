"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setOptionsData, setStep } from "@/redux/slices/adCreationSlice";

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

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all ${className}`}
    />
  );
}

export default function PublishAdOptionsModal({ onCancel, onApply }) {
  const dispatch = useDispatch();
  const options = useSelector((state) => state.adCreation.options);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: options,
  });

  const selectedOption = watch("selectedOption");

  const onSubmit = (data) => {
    dispatch(setOptionsData({ selectedOption: data.selectedOption, code: data.code }));
    if (onApply) {
      onApply(data.selectedOption, data.code);
    } else {
      dispatch(setStep("preview"));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-black mb-6">Create New Ads</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Use Code/Point To Post">
          <div className="relative mb-2">
            <select
              {...register("selectedOption")}
              className="w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="promo_code">Partner code or promo code</option>
              <option value="coin">Use Coin</option>
              <option value="none">None</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {selectedOption === "promo_code" && (
            <Field error={errors.code?.message}>
              <Input
                placeholder="Enter code here..."
                {...register("code", { required: "Promo code is required" })}
                className={errors.code ? "border-red-500" : ""}
              />
            </Field>
          )}
        </Field>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-gray hover:text-black transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm shadow-primary/20"
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}
