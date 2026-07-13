"use client";

import { X } from "lucide-react";

const OPTIONS = [
  { key: "all", label: "All conversations" },
  { key: "online", label: "Online now" },
  { key: "blocked", label: "Blocked" },
  { key: "muted", label: "Muted" },
];

export default function FilterModal({ open, onClose, activeFilter, onApply }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[360px] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Filter</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-1.5">
          {OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => {
                onApply(opt.key);
                onClose();
              }}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeFilter === opt.key
                  ? "bg-primary text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
