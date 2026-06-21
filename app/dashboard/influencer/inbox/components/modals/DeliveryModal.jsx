"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

export default function DeliveryModal({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!message) {
      toast.error("Please enter a delivery message");
      return;
    }
    toast.success("Delivery submitted successfully.");
    // Reset form
    setMessage("");
    setFile(null);
    onClose();
  };

  const handleCancel = () => {
    setMessage("");
    setFile(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
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
            Delivery
          </h3>

          <hr className="border-gray-100 mb-6 w-full" />

          {/* Delivery Message Field */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-xs font-semibold text-gray-500">Delivery Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Maximum 2500 words"
              rows={4}
              className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-xl px-4 py-3 text-sm outline-none text-gray-800 placeholder:text-gray-400 resize-none min-h-[120px]"
            />
          </div>

          {/* File Upload Area */}
          <div 
            className="mb-10 w-full border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary">
              <Upload size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-800">
                <span className="font-bold underline decoration-gray-400 underline-offset-2">Click to Upload</span> 
                <span className="text-gray-500"> or drag & drop</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {file ? file.name : "PDF, DOC, PNG, JPG or Video"}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
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
              Delivery
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
