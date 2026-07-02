"use client";

import MultiSelect from "@/components/ui/MultiSelect";

export default function AnnounceWinnerModal({
  open,
  onClose,
  participants,
  value,
  onChange,
  onSubmit,
  isLoading,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-black">Announce Winner</h2>

          <p className="text-sm text-gray mt-1">
            Select one or multiple winners.
          </p>
        </div>

        {/* Body */}

        <div className="p-6">
          <MultiSelect
            label="Participants"
            placeholder="Select participants..."
            options={participants}
            value={value}
            onChange={onChange}
          />
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-200 text-gray hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            onClick={onSubmit}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 disabled:opacity-60 transition cursor-pointer"
          >
            {isLoading ? "Announcing..." : "Announce Winner"}
          </button>
        </div>
      </div>
    </div>
  );
}
