// components/dashboard/contests/JoinContestModal.jsx
"use client";

import { X, Trophy, Ticket } from "lucide-react";

function formatEntryFee(entryFee) {
  if (entryFee === undefined || entryFee === null) return "—";
  const amount = Number(entryFee);
  if (amount === 0) return "Free";
  return `$${amount.toLocaleString()}`;
}

export default function JoinContestModal({
  open,
  onClose,
  onConfirm,
  isLoading,
  contest,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
            <Trophy size={22} className="text-white" />
          </div>

          <h2 className="text-lg font-bold text-black">Join this contest?</h2>
          <p className="text-sm text-gray leading-relaxed">
            You&apos;re about to join{" "}
            <span className="font-semibold text-black">
              {contest?.title ?? "this contest"}
            </span>
            .
          </p>

          <div className="w-full flex items-center justify-between bg-[#F7F7F7] rounded-xl px-4 py-3 mt-1">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Ticket size={13} />
              Entry Fee
            </span>
            <span className="text-sm font-bold text-black">
              {formatEntryFee(contest?.entry_fee)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
          >
            {isLoading ? "Joining..." : "Confirm & Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
