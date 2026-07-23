// components/dashboard/wallet/AmountModal.jsx
"use client";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

export default function AmountModal({
  open,
  title,
  subtitle,
  submitLabel,
  isSubmitting,
  onSubmit,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { amount: "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = data => onSubmit(Number(data.amount), reset);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-[460px] rounded-[22px] bg-white px-6 py-8 shadow-2xl sm:px-9">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-[#60706c] transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="mb-7 text-center">
          <h2 className="mb-3 text-xl font-bold text-[#2f3433]">{title}</h2>
          {subtitle && (
            <p className="mx-auto max-w-[320px] text-sm font-medium leading-[1.4] text-[#63716E]">
              {subtitle}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-[#667471]">
              Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="Enter amount"
              className="h-[54px] w-full rounded-xl border border-transparent bg-[#f7f7f7] px-4 text-base font-medium text-[#26312f] outline-none transition-all duration-300 placeholder:text-[#9aa5a2] focus:border-primary focus:bg-white"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
            />
            {errors.amount && (
              <p className="mt-2 text-sm font-medium text-secondary">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={handleClose}
              className="h-[48px] min-w-[110px] rounded-xl text-sm font-semibold text-[#004f49] transition-all duration-300 hover:bg-[#f3f3f3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[48px] min-w-[140px] rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
