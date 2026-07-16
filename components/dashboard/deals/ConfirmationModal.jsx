"use client";

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  isLoading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col p-8 text-center">
        {/* Subtle background gradient at the bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 40%, rgba(var(--color-primary-rgb), 0.15) 120%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col items-center pt-2">
          <h2 className="text-[22px] font-bold text-black mb-4">{title}</h2>
          <p className="text-[#3E524D] text-[15px] mb-8 leading-relaxed max-w-[280px]">
            {message}
          </p>

          <div className="flex items-center justify-center gap-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-[16px] font-semibold text-black hover:opacity-70 transition-opacity px-2 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-8 py-2.5 rounded-[16px] bg-gradient-to-r from-primary to-secondary text-white text-[16px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              {isLoading ? "Loading..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
