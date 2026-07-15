// components/dashboard/inbox/MessageReactions.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { SmilePlus, Loader2 } from "lucide-react";

import {
  useToggleReactionMutation,
  useGetMessageReactionsQuery,
} from "@/redux/api/services/chatApi";

const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

function ReactionTooltip({ messageId, emoji }) {
  const { data, isLoading } = useGetMessageReactionsQuery(messageId);

  // 1. Resolve key matching issues: Normalize Unicode tokens (e.g. \ud83d\udc4d -> 👍)
  const normalizedEmoji = typeof emoji === "string" ? emoji.normalize() : emoji;

  const groupedData = data?.data?.grouped ?? {};

  // Find the matching group key regardless of variant encoding differences
  const matchingKey = Object.keys(groupedData).find(
    key => key.normalize() === normalizedEmoji,
  );

  const users = matchingKey ? (groupedData[matchingKey]?.users ?? []) : [];

  // Helper to safely render initials if avatar is null
  const getInitials = name => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 
                    bg-black backdrop-blur-md text-white rounded-xl 
                    p-3 shadow-xl border border-white/10 z-50 min-w-[150px] max-w-[240px] 
                    animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-2 text-slate-400">
          <Loader2 size={14} className="animate-spin text-primary" />
          <span className="text-xs font-medium tracking-wide">
            Loading reactions...
          </span>
        </div>
      ) : users.length > 0 ? (
        <div className="flex flex-col gap-2">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-0.5">
            <span className="text-sm">{normalizedEmoji}</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              {users.length} {users.length === 1 ? "Reaction" : "Reactions"}
            </span>
          </div>

          {/* User List with Avatars */}
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {users.map(user => (
              <div
                key={user.user_id}
                className="flex items-center gap-2 text-left"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-xs text-slate-200 font-medium truncate">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-1 text-xs text-slate-400">
          No one yet
        </div>
      )}

      {/* Decorative Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-r border-b border-white/10 rotate-45 -mt-1.5" />
    </div>
  );
}

export default function MessageReactions({
  messageId,
  conversationId,
  reactions,
  isSelf,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const ref = useRef(null);
  const [toggleReaction] = useToggleReactionMutation();

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const groupedReactions = reactions?.reactions ?? {};

  const handlePick = async emoji => {
    setPickerOpen(false);
    try {
      await toggleReaction({
        messageId,
        reaction: emoji,
        conversationId,
      }).unwrap();
    } catch {
      // silent
    }
  };

  return (
    <div
      className={`relative flex items-center gap-1 mt-1 ${isSelf ? "flex-row-reverse" : ""}`}
      ref={ref}
    >
      {/* 2. Map directly over the pre-grouped object entries */}
      {Object.entries(groupedReactions).length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {Object.entries(groupedReactions).map(([emoji, count]) => (
            <div
              key={emoji}
              className="relative"
              onMouseEnter={() => setHoveredEmoji(emoji)}
              onMouseLeave={() =>
                setHoveredEmoji(cur => (cur === emoji ? null : cur))
              }
            >
              <button
                onClick={() => handlePick(emoji)}
                className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-0.5 text-xs shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>{emoji}</span>
                {count > 0 && (
                  <span className="text-gray-500 font-medium">{count}</span>
                )}
              </button>
              {hoveredEmoji === emoji && (
                <ReactionTooltip messageId={messageId} emoji={emoji} />
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setPickerOpen(v => !v)}
        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
      >
        <SmilePlus size={14} />
      </button>

      {pickerOpen && (
        <div
          className={`absolute bottom-full mb-1.5 flex items-center gap-1 bg-white border border-gray-100 rounded-full shadow-lg px-2 py-1.5 z-20 ${isSelf ? "right-0" : "left-0"}`}
        >
          {QUICK_REACTIONS.map(emoji => (
            <button
              key={emoji}
              onClick={() => handlePick(emoji)}
              className="text-lg hover:scale-125 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
