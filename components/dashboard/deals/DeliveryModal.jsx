"use client";

import { Upload } from "lucide-react";
import { useState, useEffect } from "react";

export default function DeliveryModal({
  open,
  onClose,
  onSubmit,
  title = "Mark as completed",
  isLoading = false,
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setMessage("");
      setFile(null);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!message.trim()) {
      setError("Delivery message is required.");
      return;
    }
    if (!file) {
      setError("Delivery content (file) is required.");
      return;
    }
    setError("");
    onSubmit?.({ message, file });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[600px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 border border-white/20">
        {/* Subtle background gradient at the bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0) 50%, rgba(var(--color-primary-rgb), 0.12) 150%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col">
          <h2 className="text-[22px] font-bold text-black mb-5">{title}</h2>

          <div className="border-b border-gray-100 mb-6" />

          {/* Delivery Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Delivery Message
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError("");
              }}
              placeholder="Maximum 2500 words"
              rows={4}
              className="w-full rounded-2xl bg-[#F8F9FA] border border-transparent p-5 text-[15px] text-black placeholder:text-gray-400 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-[#F8F9FA]/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  if (error) setError("");
                }}
              />
              <div className="w-[52px] h-[52px] rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                <Upload size={22} className="text-primary" />
              </div>
              <div className="text-sm">
                {file ? (
                  <span className="font-medium text-black truncate max-w-[300px] inline-block">
                    {file.name}
                  </span>
                ) : (
                  <>
                    <p className="text-black mb-1">
                      <span className="font-bold underline underline-offset-2">
                        Click to Upload
                      </span>{" "}
                      <span className="text-gray-600 font-medium">or drag & drop</span>
                    </p>
                    <p className="text-[13px] text-gray-400">
                      PDF, DOC, PNG, JPG or Video
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 mb-6" />

          {error && (
            <p className="text-red-500 text-[13px] font-medium mb-4 text-center">
              {error}
            </p>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-[15px] font-semibold text-[#1a3d33] hover:opacity-70 transition-opacity cursor-pointer px-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-2.5 rounded-[16px] bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              {isLoading ? "Loading..." : "Delivery"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
