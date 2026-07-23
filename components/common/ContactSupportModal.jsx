"use client";

import { useSubmitSupportTicketMutation } from "@/redux/api/services/commonApi";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

export default function ContactSupportModal({
  open,
  onClose,
  collapsed,
  role = "advertiser",
}) {
  const [mounted, setMounted] = useState(false);
  const [supportType, setSupportType] = useState("Suggestion");
  const [message, setMessage] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [submitSupportTicket, { isLoading }] = useSubmitSupportTicketMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      // Small delay to allow element to render before applying opacity transition
      setTimeout(() => setIsAnimating(true), 10);
    } else if (isVisible) {
      setIsAnimating(false);
      // Wait for transition to finish before unmounting
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [open, isVisible]);

  if (!isVisible || !mounted) return null;

  return createPortal(
    <div
      className={`theme-${role} font-dm-sans fixed inset-y-0 right-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-200
        ${collapsed ? "max-lg:left-0 lg:left-[72px]" : "max-lg:left-0 lg:left-[245px]"}
        ${isAnimating ? "opacity-100" : "opacity-0"}
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal panel */}
      <div
        className={`relative w-full max-w-[500px] bg-white bg-gradient-to-b from-white from-50% to-primary/20 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent transition-all duration-200
        ${isAnimating ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2"}
      `}
      >
        {/* Header */}
        <div className="px-6 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black">Contact Support</h2>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!message.trim()) {
              toast.error("Message is required.");
              return;
            }
            try {
              const res = await submitSupportTicket({
                subject: supportType,
                message: message.trim(),
              }).unwrap();
              toast.success(
                res.message || "Support ticket submitted successfully.",
              );
              setMessage("");
              onClose();
            } catch (err) {
              toast.error(err?.data?.message || "Failed to submit ticket.");
            }
          }}
          className="px-6 py-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray">
              Support Type
            </label>
            <div className="relative">
              <select
                value={supportType}
                onChange={(e) => setSupportType(e.target.value)}
                className="w-full rounded-[14px] bg-[#F8F9FA] border border-transparent px-4 py-3.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Suggestion">Suggestion</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Other">Other</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray">
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message here..."
              rows={4}
              className="w-full rounded-[14px] bg-[#F8F9FA] border border-transparent px-4 py-3.5 text-sm text-black placeholder:text-black outline-none focus:border-primary/40 focus:bg-white transition-all resize-none min-h-[120px]"
            />
          </div>

          {/* Footer: Cancel | Send */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-black hover:opacity-80 transition-opacity cursor-pointer px-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgba(var(--color-primary-rgb),0.2)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
