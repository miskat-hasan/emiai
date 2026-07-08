"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useCreateVoucherMutation,
  useGetVoucherCategoriesQuery,
} from "@/redux/api/services/voucherApi";
import { CalendarIcon } from "lucide-react";

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-500">{label}</label>
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
      className={`w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-sm text-black placeholder:text-gray-600 outline-none focus:border-primary/40 focus:bg-white transition-all ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-sm text-black placeholder:text-gray-600 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none ${className}`}
    />
  );
}

export default function CreateVoucherModal({
  open,
  onClose,
  onSuccess,
  role = "influencer",
}) {
  // Fetch from backend
  const { data: categoriesResponse, isLoading: loadingCategories } =
    useGetVoucherCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  const [createVoucher, { isLoading }] = useCreateVoucherMutation();

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

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();
      fd.append("promo_code", data.promo_code);
      fd.append("discount", data.discount);
      fd.append("discount_type", data.discount_type);
      fd.append("start_date", data.start_date);
      fd.append("end_date", data.end_date);
      fd.append("category_id", data.category_id);
      fd.append("description", data.description);

      const res = await createVoucher(fd).unwrap();

      if (res?.success || res?.code === 201 || res?.code === 200) {
        toast.success(res?.message || "Voucher created successfully!");
        onClose();
        onSuccess?.();
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create voucher.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`theme-${role} relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Gradient Overlay */}
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
            className="px-8 pt-8 pb-6 flex flex-col gap-6"
          >
            <h2 className="text-[22px] font-bold text-black mb-2">
              Create New Voucher
            </h2>

            <div className="border-t border-gray-200" />

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field
                label="Voucher Category"
                error={errors.category_id?.message}
              >
                <div className="relative">
                  <select
                    {...register("category_id", {
                      required: "Category is required",
                    })}
                    className="w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled hidden>
                      Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Promo Code" error={errors.promo_code?.message}>
                <Input
                  placeholder="Write Your Promo Code"
                  {...register("promo_code", {
                    required: "Promo code is required",
                  })}
                />
              </Field>

              <Field label="End Date" error={errors.end_date?.message}>
                <div className="relative">
                  <Input
                    type="date"
                    className="appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer text-gray-800"
                    {...register("end_date", {
                      required: "End date is required",
                    })}
                  />
                  <CalendarIcon
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                    size={18}
                  />
                </div>
              </Field>
            </div>

            {/* Row 2: Added fields to match backend expectations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Discount Value" error={errors.discount?.message}>
                <Input
                  type="number"
                  placeholder="e.g. 20"
                  {...register("discount", {
                    required: "Discount is required",
                  })}
                />
              </Field>

              <Field
                label="Discount Type"
                error={errors.discount_type?.message}
              >
                <div className="relative">
                  <select
                    {...register("discount_type", {
                      required: "Type is required",
                    })}
                    className="w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </Field>

              <Field label="Start Date" error={errors.start_date?.message}>
                <div className="relative">
                  <Input
                    type="date"
                    className="appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer text-gray-800"
                    {...register("start_date", {
                      required: "Start date is required",
                    })}
                  />
                  <CalendarIcon
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none"
                    size={18}
                  />
                </div>
              </Field>
            </div>

            {/* Row 3 */}
            <Field
              label="Voucher Description"
              error={errors.description?.message}
            >
              <Textarea
                placeholder="Write Voucher Description here...."
                rows={3}
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 120,
                    message: "Description must be at most 120 characters long"
                  }
                })}
              />
            </Field>

            <div className="border-t border-gray-200 mt-8 mb-2" />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-[15px] font-semibold text-[#1c4b44] hover:text-black transition-colors cursor-pointer px-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-md shadow-primary/30 cursor-pointer"
              >
                {isLoading ? "Creating..." : "Create Vouchers"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
