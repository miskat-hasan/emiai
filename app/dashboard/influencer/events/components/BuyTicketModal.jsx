"use client";

import { X, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

export default function BuyTicketModal({ open, onClose }) {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const onSubmit = (data) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full border-2 border-black text-black hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 px-4">
          <h2 className="text-[20px] font-medium text-black">Buy Ticket To Join</h2>
          <p className="text-[#63716E] text-[14px] mt-3 leading-relaxed">
            If you want to join the event you need to pay
          </p>
          <p className="text-black text-lg font-medium mt-1">
            Entry fee: $40
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
          {/* Ticket Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#63716E]">
              Ticket Type
            </label>
            <div className="relative">
              <select
                defaultValue=""
                {...register("ticketType", { required: true })}
                className="w-full rounded-xl bg-[#F8F9FA] border border-transparent px-4 py-3 text-[12px] text-[#203430] outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-[#63716E]">
                  Ticket Type
                </option>
                <option value="classic">Classic</option>
                <option value="vip">VIP</option>
                <option value="for-me">For Me</option>
                <option value="guest">Guest</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#203430]"
              />
            </div>
          </div>

          {/* Ticket Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#63716E]">
              Ticket Number
            </label>
            <input
              type="text"
              placeholder="Suggestion"
              {...register("ticketNumber", { required: true })}
              className="w-full rounded-xl bg-[#F8F9FA] border border-transparent px-4 py-3 text-[12px] text-[#203430] outline-none focus:border-primary/40 focus:bg-white transition-all placeholder:text-[#203430]"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-[220px] py-3 rounded-full bg-primary text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm cursor-pointer"
            >
              {isLoading ? "Processing..." : "Buy Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
