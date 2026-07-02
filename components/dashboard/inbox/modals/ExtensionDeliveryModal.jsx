"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Calendar } from "lucide-react";

export default function ExtensionDeliveryModal({ isOpen, onClose }) {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason || !date || !time) {
      toast.error("Please fill in all extension details.");
      return;
    }
    toast.success("Extension requested successfully.");
    setReason("");
    setDate("");
    setTime("");
    onClose();
  };

  const handleCancel = () => {
    setReason("");
    setDate("");
    setTime("");
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
            Extension Delivery
          </h3>

          <hr className="border-gray-100 mb-6 w-full" />

          {/* Extension Delivery Area */}
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-sm font-semibold text-gray-500">Extension Delivery</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What is this about...."
              rows={4}
              className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-4 text-sm outline-none text-gray-800 placeholder:text-gray-500 resize-none min-h-[120px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-5 mb-8">
            {/* Extension Date */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">Extension Date</label>
              <div className="relative cursor-pointer">
                {/* Fake input display to match Figma perfectly */}
                <div className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-800 flex items-center justify-between pointer-events-none">
                  <span>
                    {date 
                      ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : "23 Jun 2035"}
                  </span>
                  <Calendar size={18} className="text-gray-600" />
                </div>
                
                {/* Invisible actual date input stretched over the entire container */}
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Extension Time */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-500">Extension Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="25 days"
                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-3.5 text-sm outline-none text-gray-800 placeholder:text-gray-800"
              />
            </div>
          </div>

          <hr className="border-gray-100 mb-6 w-full" />

          <div className="flex items-center justify-between w-full pt-1">
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
              Extension Request
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
