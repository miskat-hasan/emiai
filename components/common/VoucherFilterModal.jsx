"use client";

import {
  useGetCountriesQuery,
  useGetVoucherCategoriesQuery,
} from "@/redux/api/services/voucherApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[15px] font-medium text-gray-500">{label}</label>
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
      className={`w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3.5 text-[15px] text-black placeholder:text-gray-600 outline-none focus:border-primary/40 focus:bg-white transition-all ${className}`}
    />
  );
}

export default function VoucherFilterModal({
  open,
  onClose,
  onFilter,
  role = "influencer",
}) {
  // Fetch from backend
  const { data: categoriesResponse } = useGetVoucherCategoriesQuery();
  const { data: countriesResponse } = useGetCountriesQuery();

  const categories = categoriesResponse?.data || [];
  const countries = countriesResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data) => {
    onFilter?.(data);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`theme-${role} relative w-full max-w-[460px] bg-white rounded-[24px] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/*Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, rgba(var(--color-primary-rgb), 0.15) 100%)",
          }}
        />

        <div className="relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-8 pt-8 pb-8 flex flex-col gap-6"
          >
            <h2 className="text-xl font-bold text-black mb-1">
              Vouchers Filter
            </h2>

            <div className="border-t border-gray-200 -mx-2" />

            <div className="flex flex-col gap-5">
              <Field
                label="Filter By Categories"
                error={errors.category_id?.message}
              >
                <div className="relative">
                  <select
                    {...register("category_id")}
                    className="w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3.5 text-[15px] text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled hidden>
                      Restaurants
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Field>

              <Field label="Country" error={errors.country_id?.message}>
                <div className="relative">
                  <select
                    {...register("country_id")}
                    className="w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3.5 text-[15px] text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled hidden>
                      Bangladesh
                    </option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Field>

              <Field
                label="Publisher Name"
                error={errors.publisher_name?.message}
              >
                <Input
                  placeholder="Write Publisher Name here..."
                  {...register("publisher_name")}
                />
              </Field>

              <Field label="Vouchers Key Word" error={errors.keyword?.message}>
                <Input
                  placeholder="Write Vouchers Key Word here..."
                  {...register("keyword")}
                />
              </Field>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-[16px] font-medium text-[#1c4b44] hover:text-black transition-colors cursor-pointer px-1"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-primary text-white text-[15px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
