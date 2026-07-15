"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { X, Search, Send } from "lucide-react";
import {
  useGetConversationsQuery,
  useForwardMessageMutation,
} from "@/redux/api/services/chatApi";
import { mapConversationToChat } from "../chatMappers";

export default function ForwardMessageModal({ message, open, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const { data } = useGetConversationsQuery(undefined, { skip: !open });
  const [forwardMessage, { isLoading }] = useForwardMessageMutation();

  if (!open || !message) return null;

  const chats = (data?.data ?? [])
    .map(mapConversationToChat)
    .filter(c => c.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleForward = async () => {
    if (selectedIds.length === 0) return;
    try {
      await forwardMessage({
        messageId: message.id,
        conversation_ids: selectedIds,
      }).unwrap();
      toast.success("Message forwarded.");
      setSelectedIds([]);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't forward message.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[380px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[75vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Forward to</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-3 shrink-0">
          <div className="bg-[#F9F9F9] rounded-xl px-4 py-2.5 flex items-center gap-2 border border-gray-100">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
          <div className="flex flex-col gap-1 pb-3">
            {chats.map(chat => {
              const isSelected = selectedIds.includes(chat.id);
              return (
                <button
                  key={chat.id}
                  onClick={() => toggleSelect(chat.id)}
                  className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {chat.user.name}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "bg-primary border-primary" : "border-gray-200"}`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 pt-3 shrink-0">
          <button
            onClick={handleForward}
            disabled={selectedIds.length === 0 || isLoading}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center justify-center gap-2"
          >
            <Send size={14} />
            {isLoading
              ? "Forwarding..."
              : `Forward${selectedIds.length ? ` (${selectedIds.length})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
