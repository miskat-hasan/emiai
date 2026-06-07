"use client";

import { Bookmark } from "lucide-react";
import Image from "next/image";

export default function MessageBookmarkCard({
  avatar,
  initials = "HR",
  avatarBg = "bg-teal-700",
  threadLabel,
  senderName = "Esther Howard",
  time = "03:11 PM",
  preview = "Hi there, I'm interested in learning more about the company's privacy policy. Can you direct...",
  bookmarked = true,
  onBookmark,
}) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Avatar */}
      <div className="shrink-0">
        {avatar ? (
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <Image
              src={avatar}
              alt={senderName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center`}
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {threadLabel && (
          <p className="text-xs font-semibold text-[#203430] leading-none mb-0.5">
            {threadLabel}
          </p>
        )}
        <p
          className={`text-sm font-semibold text-[#203430] leading-tight ${threadLabel ? "" : "mb-0.5"}`}
        >
          {senderName}
        </p>
        <p className="text-xs text-[#63716E] line-clamp-2 mt-1 leading-relaxed">
          {preview}
        </p>
      </div>

      {/* Right: time + bookmark */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs text-[#63716E]">{time}</span>
        <button onClick={onBookmark} aria-label="Bookmark">
          <Bookmark
            size={13}
            className={
              bookmarked ? "fill-primary text-primary" : "text-gray-300"
            }
          />
        </button>
      </div>
    </div>
  );
}
