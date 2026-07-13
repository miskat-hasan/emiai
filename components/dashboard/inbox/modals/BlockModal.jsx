"use client";

import React from "react";
import { toast } from "react-toastify";
import { useToggleBlockUserMutation } from "@/redux/api/services/chatApi";

export default function BlockModal({ isOpen, onClose, userId, userName }) {
  const [toggleBlockUser, { isLoading }] = useToggleBlockUserMutation();

  if (!isOpen) return null;

  const handleBlock = async () => {
    try {
      const res = await toggleBlockUser(userId).unwrap();
      toast.success(res?.message ?? `Blocked ${userName} successfully.`);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't block this user.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative flex flex-col items-center px-8 py-10 text-center z-10">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Block "{userName}"
          </h3>
          <p className="text-sm text-gray-500 mb-8 px-2">
            Are you sure you want to block{" "}
            <span className="font-semibold text-gray-700">"{userName}"</span>?
          </p>

          <div className="flex items-center justify-center gap-6 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-sm font-semibold text-[#006253] hover:text-[#004b40] transition-colors cursor-pointer disabled:opacity-50"
            >
              No
            </button>
            <button
              onClick={handleBlock}
              disabled={isLoading}
              className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.25)] cursor-pointer disabled:opacity-50 min-w-[90px]"
            >
              {isLoading ? "Blocking..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
