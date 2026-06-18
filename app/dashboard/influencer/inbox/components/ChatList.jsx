"use client";

import React, { memo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ChatItem from "./ChatItem";

const ChatList = memo(({ chats, selectedChatId, onSelectChat, searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col h-full bg-white/50">
      {/* Header / Search Area */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white transition-colors rounded-full py-2.5 pl-10 pr-4 text-sm outline-none text-black placeholder:text-gray-400"
          />
        </div>
        <button className="w-10 h-10 shrink-0 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Chat List Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {chats.length > 0 ? (
          <div className="flex flex-col">
            {chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
});

ChatList.displayName = "ChatList";

export default ChatList;
