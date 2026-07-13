"use client";

import React from "react";
import { toast } from "react-toastify";
import { useLeaveGroupMutation } from "@/redux/api/services/chatApi";

export default function LeaveGroupModal({ isOpen, onClose, groupId }) {
  const [leaveGroup, { isLoading }] = useLeaveGroupMutation();

  if (!isOpen) return null;

  const handleLeave = async () => {
    try {
      const res = await leaveGroup(groupId).unwrap();
      toast.success(res?.message ?? "Left group chat successfully.");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't leave the group.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[440px] bg-gradient-to-b from-white via-white to-primary/10 rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="relative flex flex-col items-center px-8 py-10 text-center z-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Leave</h3>
          <p className="text-[15px] text-gray-600 mb-10 px-2 font-medium">
            Are you sure you want to leave the group chat?
          </p>

          <div className="flex items-center justify-center gap-6 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-[15px] font-semibold text-[#125B50] hover:text-[#0a3830] transition-colors cursor-pointer px-4 py-2 disabled:opacity-50"
            >
              No
            </button>
            <button
              onClick={handleLeave}
              disabled={isLoading}
              className="bg-primary text-white px-10 py-2.5 rounded-xl text-[15px] font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.25)] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Leaving..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
