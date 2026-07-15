// components/dashboard/inbox/MessageReactions.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import { useToggleReactionMutation } from "@/redux/api/services/chatApi";

const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function MessageReactions({
  messageId,
  conversationId,
  reactions = {},
  isSelf,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const ref = useRef(null);
  const [toggleReaction] = useToggleReactionMutation();

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const grouped = reactions?.reactions || {};

  const handlePick = async emoji => {
    setPickerOpen(false);
    try {
      await toggleReaction({
        messageId,
        reaction: emoji,
        conversationId,
      }).unwrap();
    } catch {
      // silent — reaction toggle failures aren't worth interrupting the user
    }
  };

  return (
    <div
      className={`relative flex items-center gap-1 mt-1 ${isSelf ? "flex-row-reverse" : ""}`}
      ref={ref}
    >
      {Object.entries(grouped).length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {Object.entries(grouped).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => handlePick(emoji)}
              className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-2 py-0.5 text-xs shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>{emoji}</span>
              {count > 0 && (
                <span className="text-gray-500 font-medium">{count}</span>
              )}
            </button>
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
