"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon } from "lucide-react";

export default function ShareModal({ open, onClose, initialMode = "link", link = "reelup/sgdoghd-vhxc" }) {
  const [mode, setMode] = useState(initialMode); // "link" | "qr"

  // Reset mode when opened
  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex flex-col w-full max-w-[340px]">
        {/* Modal Card */}
        <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col relative">
          {/*Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(var(--color-primary-rgb), 0.15) 100%)" }}
          />
          <div className="relative z-10 p-6 flex flex-col items-center text-center">

            {mode === "success" ? (
            <>
              {/* Reward Placeholder Image */}
              <div className="w-full flex justify-center mb-6">
                <img 
                  src="/images/50%20coins.png" 
                  alt="Reward Coins" 
                  className="w-[85%] object-contain mix-blend-multiply"
                />
              </div>

              <h4 className="text-[20px] font-medium text-black mb-8 px-2 leading-snug">
                You reward wining Increase 10%
              </h4>

              <button 
                onClick={onClose}
                className="w-[85%] py-3.5 rounded-full bg-primary text-white text-[18px] font-medium hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgba(240,90,40,0.25)]"
              >
                Ok
              </button>
            </>
          ) : mode === "link" ? (
            <>
              {/* Circular Icon */}
              <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-md">
                <LinkIcon className="text-white w-10 h-10" />
              </div>

              <h4 className="text-[20px] font-bold text-black mb-2">Invite Link</h4>
              <p className="text-[14px] text-gray-500 mb-6 px-2 leading-relaxed">
                Anyone will be able to download the app by following this link.
              </p>

              {/* Readonly Link Input */}
              <div className="w-full mb-6">
                <input
                  type="text"
                  readOnly
                  value={link}
                  className="w-full text-center bg-transparent border border-gray-200 rounded-xl py-3 text-[15px] font-medium text-black focus:outline-none"
                />
              </div>

              {/* Share Link Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  // Simulate successful share backend call
                  setMode("success");
                }}
                className="w-full py-3.5 rounded-xl bg-primary text-white text-[16px] font-medium hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgba(240,90,40,0.25)] mb-4"
              >
                Share Link
              </button>

              {/* Toggle to QR */}
              <button
                onClick={() => setMode("qr")}
                className="text-[15px] font-medium text-black hover:text-primary transition-colors"
              >
                Get QR Code
              </button>
            </>
          ) : (
            <>
              <h4 className="text-[18px] font-bold text-black mb-4">Invite by QR Code</h4>

              {/* QR Placeholder */}
              <div className="w-full aspect-square mb-4 bg-gray-50 flex items-center justify-center rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`}
                  alt="QR Code"
                  className="w-[85%] h-[85%] object-contain mix-blend-multiply"
                />
              </div>

              <p className="text-[14px] text-gray-500 mb-6 px-4 leading-relaxed">
                Anyone can scan the code to download the app
              </p>

              {/* Share QR Button */}
              <button
                onClick={() => {
                  // Simulate successful share backend call
                  setMode("success");
                }}
                className="w-full py-3.5 rounded-xl bg-primary text-white text-[16px] font-medium hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgba(240,90,40,0.25)]"
              >
                Share QR Code
              </button>

              {/* Toggle back to link */}
              <button
                onClick={() => setMode("link")}
                className="text-[14px] font-medium text-gray-400 hover:text-black transition-colors mt-4"
              >
                Back to Link
              </button>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
