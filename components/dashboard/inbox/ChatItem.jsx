// components/dashboard/inbox/ChatItem.jsx
"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import React, { memo } from "react";
import Image from "next/image";
import { Bookmark } from "lucide-react";

const ChatItem = memo(({ chat, isSelected, onClick }) => {
  const { user, lastMessage, unreadCount, isStarred } = chat;

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full text-left p-4 rounded-xl transition-all duration-200 border-b border-gray-50/50 last:border-b-0
        ${isSelected ? "bg-gradient-to-b from-white to-primary/10" : "hover:bg-gray-50"}
      `}
    >
      {/* Avatar Area */}
      <div className="relative shrink-0 mt-1">
        {user.avatar.length > 2 ? (
          <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-100">
            <Image
              src={getImageUrl(user.avatar)}
              alt={user.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#125B50] text-white flex items-center justify-center font-bold text-sm">
            {user.avatar}
          </div>
        )}

        {/* Online Indicator */}
        {user.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 truncate">
            <h4 className={`font-bold text-[15px] truncate ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
              {user.name}
            </h4>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full shrink-0">
                {unreadCount < 10 ? `0${unreadCount}` : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400 shrink-0 whitespace-nowrap ml-2">
            {lastMessage.timestamp}
          </span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            {lastMessage.sender && <span className="font-semibold text-xs text-gray-900 mb-0.5">{lastMessage.sender}</span>}
            <p className={`text-[13px] truncate w-full ${unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              {lastMessage.text}
            </p>
          </div>
          {isStarred && (
            <Bookmark size={14} className="text-gray-500 shrink-0 fill-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
});

ChatItem.displayName = "ChatItem";

export default ChatItem;
