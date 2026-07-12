"use client";
import { X } from "lucide-react";
import React, { useEffect } from "react";

const Modal = ({
  open,
  onClose,
  children,
  panelClassName = "max-w-lg bg-white rounded-2xl p-5",
  hideClose = false,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[1px] p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative z-10 w-full max-h-[calc(100vh-50px)] overflow-y-auto shadow-lg ${panelClassName}`}
        onClick={e => e.stopPropagation()}
      >
        {children}

        {!hideClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 grid place-items-center cursor-pointer text-gray-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
