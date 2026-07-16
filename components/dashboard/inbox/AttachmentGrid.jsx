// components/dashboard/inbox/AttachmentGrid.jsx
"use client";

import { useState } from "react";
import { FileText, Play, Download } from "lucide-react";
import Lightbox from "./Lightbox";

function formatSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function AttachmentGrid({ attachments }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!attachments || attachments.length === 0) return null;

  const media = attachments.filter((a) => a.type === "image" || a.type === "video");
  const files = attachments.filter((a) => a.type !== "image" && a.type !== "video");

  const gridCols = media.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <>
      {media.length > 0 && (
        <div className={`grid ${gridCols} max-w-[400px] gap-1.5 px-5 py-3 -z-0`}>
          {media.map((att, i) => (
            <button
              key={att.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
            >
              {att.type === "image" ? (
                <img
                  src={att.url}
                  alt={att.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <>
                  <video src={att.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={18} className="text-black ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-1.5 px-5 pb-3">
          {files.map((att) => (
            <a
              key={att.id}
              href={att.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white/60 border border-gray-100 rounded-xl px-3 py-2.5 hover:bg-white transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 truncate">{att.name}</p>
                <p className="text-[10px] text-gray-400">{formatSize(att.size)}</p>
              </div>
              <Download size={14} className="text-gray-400 shrink-0" />
            </a>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={media}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}