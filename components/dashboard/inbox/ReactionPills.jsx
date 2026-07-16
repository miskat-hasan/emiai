"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  useToggleReactionMutation,
  useGetMessageReactionsQuery,
} from "@/redux/api/services/chatApi";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function Tooltip({ messageId, emoji, isSelf }) {
  const { data, isLoading } = useGetMessageReactionsQuery(messageId);
  const normalized = typeof emoji === "string" ? emoji.normalize() : emoji;
  const grouped = data?.data?.grouped ?? {};
  const key = Object.keys(grouped).find(k => k.normalize() === normalized);
  const users = key ? (grouped[key]?.users ?? []) : [];

  return (
    <div
      className={`absolute bottom-full mb-2.5 ${isSelf ? "right-0" : "left-0"} bg-gray-900 text-white rounded-xl p-3 shadow-xl border border-white/10 z-30 min-w-[150px] max-w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-150`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-1.5 text-gray-400">
          <Loader2 size={13} className="animate-spin" />
          <span className="text-xs font-medium">Loading...</span>
        </div>
      ) : users.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="text-sm">{normalized}</span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
              {users.length} {users.length === 1 ? "reaction" : "reactions"}
            </span>
          </div>
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {users.map(u => (
              <div key={u.user_id} className="flex items-center gap-2">
                {u.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {getInitials(u.name)}
                  </div>
                )}
                <span className="text-xs text-gray-200 font-medium truncate">
                  {u.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-1 text-xs text-gray-400">No one yet</div>
      )}
      <div
        className={`absolute top-full ${isSelf ? "right-4" : "left-4"} w-2 h-2 bg-gray-900 rotate-45 -mt-1`}
      />
    </div>
  );
}

// message.reactions.reactions comes back pre-grouped as an object,
// e.g. { "👍": 1, "❤️": 2 } — confirmed from real API data. Per-user data
// only exists via the dedicated GET .../reaction endpoint (used above on hover).
export default function ReactionPills({
  messageId,
  conversationId,
  reactions,
  isSelf,
}) {
  const [hovered, setHovered] = useState(null);
  const [toggleReaction] = useToggleReactionMutation();

  const grouped = reactions?.reactions ?? {};
  const entries = Object.entries(grouped).filter(([, count]) => count > 0);
  if (entries.length === 0) return null;

  const handleToggle = async emoji => {
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
      className={`flex items-center gap-1 flex-wrap ${isSelf ? "flex-row-reverse" : ""}`}
    >
      {entries.map(([emoji, count]) => (
        <div
          key={emoji}
          className="relative"
          onMouseEnter={() => setHovered(emoji)}
          onMouseLeave={() => setHovered(c => (c === emoji ? null : c))}
        >
          <button
            onClick={e => {
              e.stopPropagation();
              handleToggle(emoji);
            }}
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs shadow-xs transition-colors cursor-pointer border bg-white border-gray-100 hover:bg-gray-50"
          >
            <span>{emoji}</span>
            {count > 1 && (
              <span className="font-medium text-gray-500">{count}</span>
            )}
          </button>
          {hovered === emoji && (
            <Tooltip messageId={messageId} emoji={emoji} isSelf={isSelf} />
          )}
        </div>
      ))}
    </div>
  );
}
