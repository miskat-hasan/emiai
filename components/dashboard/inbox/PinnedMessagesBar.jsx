"use client";

import { useState } from "react";
import { Pin, ChevronDown, X } from "lucide-react";
import {
  useGetPinnedMessagesQuery,
  useTogglePinMessageMutation,
} from "@/redux/api/services/chatApi";

export default function PinnedMessagesBar({ conversationId }) {
  const [expanded, setExpanded] = useState(false);
  const { data } = useGetPinnedMessagesQuery(conversationId, {
    skip: !conversationId,
  });
  const [togglePin] = useTogglePinMessageMutation();

  const pinned = data?.data ?? [];
  if (pinned.length === 0) return null;

  const handleUnpin = async messageId => {
    try {
      await togglePin({ messageId, conversationId }).unwrap();
    } catch {
      // silent
    }
  };

  return (
    <div className="border-b border-gray-50/50 bg-primary/5">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Pin size={13} />
          {pinned.length} pinned message{pinned.length > 1 ? "s" : ""}
        </div>
        <ChevronDown
          size={14}
          className={`text-primary transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-3 flex flex-col gap-1.5 max-h-40 overflow-y-auto">
          {pinned.map(msg => (
            <div
              key={msg.id}
              className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <span className="font-semibold text-gray-700">
                  {msg.sender?.name}:{" "}
                </span>
                <span className="text-gray-500 truncate">
                  {msg.message ?? `[${msg.message_type}]`}
                </span>
              </div>
              <button
                onClick={() => handleUnpin(msg.id)}
                className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
