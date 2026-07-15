"use client";

import { useState } from "react";

export default function InputModal({
  open,
  onClose,
  onSubmit,
  title,
  placeholder = "Maximum 2500 words",
  submitText = "Submit",
  isLoading = false,
}) {
  const [inputValue, setInputValue] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit(inputValue);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col p-8 text-center">
        {/* Subtle background gradient at the bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 40%, rgba(var(--color-primary-rgb), 0.15) 120%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col pt-2">
          <h2 className="text-[22px] font-bold text-black mb-6 text-center">
            {title}
          </h2>

          <div className="mb-6 text-left">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full rounded-2xl bg-[#F7F7F7] border border-transparent p-5 text-[15px] text-black placeholder:text-gray/80 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            className="w-full py-3.5 rounded-[16px] bg-gradient-to-r from-primary to-secondary text-white text-[16px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
          >
            {isLoading ? "Submitting..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
