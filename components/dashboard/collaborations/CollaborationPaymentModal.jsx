// components/dashboard/collaborations/CollaborationPaymentModal.jsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRequestPaymentMutation } from "@/redux/api/services/collaboratorsApi";

export default function CollaborationPaymentModal({
  open,
  collaboration,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const [requestPayment, { isLoading: isSubmitting }] =
    useRequestPaymentMutation();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async data => {
    try {
      await requestPayment({
        invitation_id: collaboration?.id,
        amount: Number(data.amount),
      }).unwrap();

      toast.success("Payment request created successfully");
      handleClose();
    } catch (error) {
      console.error("Error creating payment request:", error);
      toast.error(error?.data?.message || "Failed to create payment request");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-[505px] rounded-[22px] bg-white px-8 py-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="mb-5 text-2xl font-bold text-[#2f3433]">
            Payment Request
          </h2>
          <p className="mx-auto max-w-[390px] text-lg font-medium leading-[1.35] text-[#2f3a38]">
            Make a payment required for Collaborations the event
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <label className="mb-3 block text-lg font-semibold text-[#667471]">
              Payment Amount
            </label>

            <input
              type="number"
              min="1"
              step="any"
              placeholder="Enter amount"
              className="h-[62px] w-full rounded-xl border border-transparent bg-[#f7f7f7] px-5 text-lg font-medium text-[#26312f] outline-none transition-all duration-300 placeholder:text-[#26312f] focus:border-primary focus:bg-white"
              {...register("amount", {
                required: "Payment amount is required",
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
            />

            {errors.amount && (
              <p className="mt-2 text-sm font-medium text-secondary">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={handleClose}
              className="h-[54px] min-w-[120px] rounded-xl text-lg font-semibold text-[#004f49] transition-all duration-300 hover:bg-[#f3f3f3]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[54px] min-w-[78px] rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-lg font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "..." : "Yes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
