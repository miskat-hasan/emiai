"use client";

import { useState, useRef, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import { useToggleReactionMutation } from "@/redux/api/services/chatApi";

const QUICK_REACTIONS = ["❤️", "😂", "👍", "😮", "😢", "🔥"];

export default function AddReactionButton({
  messageId,
  conversationId,
  isSelf,
  compact,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [toggleReaction] = useToggleReactionMutation();

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePick = async emoji => {
    setOpen(false);
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
    <div className="relative" ref={ref}>
      <button
        onClick={e => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        className={`rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer ${compact ? "w-7 h-7" : "w-8 h-8"}`}
      >
        <SmilePlus size={14} />
      </button>
      {open && (
        <div
          className={`absolute top-8 flex items-center gap-1 bg-white border border-gray-100 rounded-full shadow-lg px-2 py-1.5 z-30 ${isSelf ? "right-0" : "left-0"}`}
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
