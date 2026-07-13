// components/dashboard/inbox/modals/ReportModal.jsx
"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ReportModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !category || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Report submitted successfully.");
    // Reset form
    setName("");
    setCategory("");
    setMessage("");
    onClose();
  };

  const handleCancel = () => {
    setName("");
    setCategory("");
    setMessage("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && handleCancel()}
    >
      <div className="relative w-full max-w-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Subtle bottom gradient glow */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative flex flex-col p-6 lg:p-8 z-10">
          <h3 className="text-xl font-bold text-gray-900 mb-5">
            Report The Person
          </h3>

          <hr className="border-gray-100 mb-6 w-full" />

          <div className="flex flex-col md:flex-row gap-5 mb-5">
            {/* Name Field */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-3 text-sm outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Support Category Field */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Support Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Deal Issue"
                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-3 text-sm outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-2 mb-10">
            <label className="text-xs font-semibold text-gray-500">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Maximum 2500 words"
              rows={4}
              className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-3 text-sm outline-none text-gray-800 placeholder:text-gray-400 resize-none min-h-[120px]"
            />
          </div>

          <div className="flex items-center justify-between w-full border-t border-gray-100 pt-6">
            <button 
              onClick={handleCancel}
              className="text-sm font-semibold text-[#006253] hover:text-[#004b40] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.25)] cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
