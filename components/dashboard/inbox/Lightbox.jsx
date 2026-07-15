// components/dashboard/inbox/Lightbox.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function Lightbox({ items, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const item = items[index];

  const goPrev = useCallback(
    () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1)),
    [items.length],
  );
  const goNext = useCallback(
    () => setIndex((i) => (i === items.length - 1 ? 0 : i + 1)),
    [items.length],
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [goPrev, goNext, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
      >
        <X size={20} />
      </button>

      <a
        href={item.url}
        download={item.name}
        target="_blank"
        rel="noreferrer"
        className="absolute top-5 right-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
      >
        <Download size={18} />
      </a>

      {items.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        {item.type === "image" ? (
          <img src={item.url} alt={item.name} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        ) : (
          <video src={item.url} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg" />
        )}
      </div>

      {items.length > 1 && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs">
          {index + 1} / {items.length}
        </span>
      )}
    </div>
  );
}