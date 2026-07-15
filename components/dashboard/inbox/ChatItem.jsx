// components/dashboard/inbox/ChatItem.jsx
"use client";
import { getImageUrl } from "@/helper/getImageUrl";
import React, { memo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Bookmark, MoreVertical, Trash2, Ban } from "lucide-react";
import { toast } from "react-toastify";
import {
  useDeleteConversationMutation,
  useToggleBlockUserMutation,
} from "@/redux/api/services/chatApi";
import BlockModal from "./modals/BlockModal";

const ChatItem = memo(({ chat, isSelected, onClick, onDeleted }) => {
  const { user, lastMessage, unreadCount, isStarred } = chat;
  const [menuOpen, setMenuOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const menuRef = useRef(null);

  const [deleteConversation, { isLoading: isDeleting }] =
    useDeleteConversationMutation();

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = async e => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await deleteConversation(chat.id).unwrap();
      toast.success("Conversation deleted.");
      onDeleted?.();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't delete conversation.");
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
         group relative w-full flex items-start gap-3 text-left p-4 rounded-xl transition-all duration-200 border-b border-gray-50/50 last:border-b-0 cursor-pointer
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
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 truncate">
            <h4
              className={`font-bold text-[15px] truncate ${isSelected ? "text-gray-900" : "text-gray-900"}`}
            >
              {user.name}
            </h4>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full shrink-0">
                {unreadCount < 10 ? `0${unreadCount}` : unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0" ref={menuRef}>
            <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2 group-hover:hidden">
              {lastMessage.timestamp}
            </span>
            <button
              onClick={e => {
                e.stopPropagation();
                setMenuOpen(v => !v);
              }}
              className="hidden group-hover:flex md:opacity-0 md:group-hover:opacity-100 w-6 h-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer relative"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30"
              >
                {user.role !== "Group" && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setBlockOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Ban size={13} />
                    Block user
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  {isDeleting ? "Deleting..." : "Delete conversation"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            {lastMessage.sender && (
              <span className="font-semibold text-xs text-gray-900 mb-0.5">
                {lastMessage.sender}
              </span>
            )}
            <p
              className={`text-[13px] truncate w-full ${unreadCount > 0 ? "text-gray-800 font-medium" : "text-gray-500"}`}
            >
              {lastMessage.text}
            </p>
          </div>
          {isStarred && (
            <Bookmark
              size={14}
              className="text-gray-500 shrink-0 fill-gray-500"
            />
          )}
        </div>
      </div>
      <BlockModal
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        userId={user.id}
        userName={user.name}
      />
    </div>
  );
});

ChatItem.displayName = "ChatItem";

export default ChatItem;
