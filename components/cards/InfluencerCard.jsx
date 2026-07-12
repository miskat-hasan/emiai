"use client";

import Image from "next/image";
import { Bookmark, MessageSquare, Briefcase, CheckCircle } from "lucide-react";

// ─── Social platform icons (SVG inline) ──────────────────────────────────────

const PLATFORM_ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig1)" />
      <circle
        cx="12"
        cy="12"
        r="4.5"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="17" cy="7" r="1" fill="white" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
      <rect width="24" height="24" rx="6" fill="#000" />
      <path
        d="M17 8.5c-1.2-.1-2.1-.8-2.5-1.8V15a3.5 3.5 0 11-3.5-3.5c.2 0 .3 0 .5.1V14a1.5 1.5 0 100 2 1.5 1.5 0 001.5-1.5V5h2c.1 1.8 1.4 3.3 3 3.5v2l-1-.5z"
        fill="white"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        d="M13.5 7H15V5h-1.5C11.6 5 10 6.6 10 8.5V10H8v2h2v7h2v-7h2l.5-2H12V8.5c0-.8.7-1.5 1.5-1.5z"
        fill="white"
      />
    </svg>
  ),
  snapchat: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
      <rect width="24" height="24" rx="6" fill="#FFFC00" />
      <path
        d="M12 5c-1.9 0-3.5 1.6-3.5 3.5 0 .4.1.8.2 1.1-.3.1-.5.1-.7.1-.3 0-.5-.1-.5-.1l-.2.7s.4.2.9.2c.2 0 .4 0 .7-.1-.1.3-.5.6-1.2.8l.1.7c.9-.1 1.5-.5 1.9-.9.5.3 1.1.5 1.8.5s1.3-.2 1.8-.5c.4.4 1 .8 1.9.9l.1-.7c-.7-.2-1.1-.5-1.2-.8.2.1.4.1.7.1.5 0 .9-.2.9-.2l-.2-.7s-.2.1-.5.1c-.2 0-.4 0-.7-.1.1-.3.2-.7.2-1.1C15.5 6.6 13.9 5 12 5z"
        fill="black"
      />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path
        d="M19 8.5s-.2-1.4-.8-1.9c-.7-.8-1.5-.8-1.9-.9C14.8 6.5 12 6.5 12 6.5s-2.8 0-4.3.2c-.4 0-1.2.1-1.9.9-.6.5-.8 1.9-.8 1.9S5 10.1 5 11.7v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 1.9c.7.8 1.7.7 2.1.8 1.5.1 6.4.2 6.4.2s2.8 0 4.3-.2c.4-.1 1.2-.1 1.9-.9.6-.5.8-1.9.8-1.9S22 14.8 22 13.2v-1.5C22 10.1 19 8.5 19 8.5zM10.5 14.5v-4l4.5 2-4.5 2z"
        fill="white"
      />
    </svg>
  ),
};

const PLATFORM_LIST = ["instagram", "tiktok", "facebook"];

/**
 * InfluencerCard
 * Used in: Influencers page, Smart Matching page
 *
 * Props:
 *  - id, name, avatar, followers, rate, platforms
 *  - variant: "influencer" | "smart-matching"
 *  - matchPct: number (smart-matching only)
 *  - whyFit: string (smart-matching only)
 *  - bookmarked: boolean
 *  - onChat, onProposeDeal, onAIPredict, onBookmark
 */
export default function InfluencerCard({
  id,
  name = "Arlene McCoy",
  avatar = null,
  followers = "19M",
  rate = "4.2",
  platforms = PLATFORM_LIST,
  variant = "influencer",
  matchPct = 95,
  whyFit = "",
  bookmarked = false,
  onChat,
  onProposeDeal,
  onAIPredict,
  onBookmark,
}) {
  const isSmartMatch = variant === "smart-matching";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 relative">
      {/* Bookmark */}
      <button
        onClick={onBookmark}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-primary/40 transition-colors shadow-sm"
      >
        <Bookmark
          size={13}
          className={
            bookmarked ? "fill-primary text-primary" : "text-[#63716E]"
          }
        />
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isSmartMatch ? "border-secondary" : "border-gray-100"} shadow-sm`}
          >
            {avatar ? (
              <Image src={avatar?.startsWith("http") ? avatar : `${process.env.NEXT_PUBLIC_API_URL}/${avatar?.startsWith('/') ? avatar.slice(1) : avatar}`} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{name[0]}</span>
              </div>
            )}
          </div>
          {/* Match % badge */}
          {isSmartMatch && (
            <span className="absolute -bottom-1 -right-1 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              {matchPct}% Match
            </span>
          )}
        </div>

        <h3 className="mt-3 text-base font-bold text-[#203430]">{name}</h3>

        {/* Platform icons */}
        <div className="flex items-center gap-2 mt-2">
          {platforms.map(p => (
            <div
              key={p}
              className="w-7 h-7 rounded-full overflow-hidden shadow-sm"
            >
              {PLATFORM_ICONS[p] ?? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                  {p[0].toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Smart Matching — "Why it's a good fit" */}
      {isSmartMatch && whyFit && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-[#203430] text-center mb-1.5">
            Why it&apos;s a good fit
          </p>
          <p className="text-xs text-[#63716E] text-center leading-relaxed">
            {whyFit}
          </p>
        </div>
      )}

      {/* Influencer — followers + rate stats */}
      {!isSmartMatch && (
        <div className="mx-4 mb-3 bg-gray-50 rounded-xl px-4 py-3 grid grid-cols-2 gap-2">
          <div className="text-center">
            <p className="text-xs text-[#63716E]">Followers</p>
            <p className="text-base font-bold text-[#203430]">{followers}</p>
          </div>
          <div className="text-center border-l border-gray-200">
            <p className="text-xs text-[#63716E]">Rate</p>
            <p className="text-base font-bold text-[#203430]">{rate}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-4 flex flex-col gap-2 mt-auto">
        {isSmartMatch && (
          <button
            onClick={onAIPredict}
            className="w-full py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            AI Performance Prediction
          </button>
        )}
        <div className={`flex gap-2 ${isSmartMatch ? "" : ""}`}>
          <button
            onClick={onChat}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#203430] hover:bg-gray-50 transition-colors"
          >
            <MessageSquare size={14} />
            Chat
          </button>
          <button
            onClick={onProposeDeal}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Briefcase size={14} />
            Propose Deal
          </button>
        </div>
      </div>
    </div>
  );
}
