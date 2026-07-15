"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { X, Search } from "lucide-react";
import { getImageUrl } from "@/helper/getImageUrl";
import {
  useGetAvailableUsersQuery,
  useStartPrivateConversationMutation,
} from "@/redux/api/services/chatApi";

export default function NewChatModal({ open, onClose, onStarted }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGetAvailableUsersQuery(
    { q: searchQuery || undefined },
    { skip: !open },
  );
  const [startConversation, { isLoading: isStarting }] =
    useStartPrivateConversationMutation();

  if (!open) return null;
  const users = data?.data?.data ?? [];

  const handlePick = async userId => {
    try {
      const res = await startConversation({ receiver_id: userId }).unwrap();
      onStarted?.(res?.data);
      setSearchQuery("");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't start conversation.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[400px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">New message</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-4 shrink-0">
          <div className="bg-[#F9F9F9] rounded-xl px-4 py-3 flex items-center gap-2 border border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search people"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
          <div className="flex flex-col gap-1">
            {isLoading && (
              <p className="text-center text-xs text-gray-400 py-4">
                Loading...
              </p>
            )}
            {!isLoading && users.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-4">
                No users found.
              </p>
            )}
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handlePick(user.id)}
                disabled={isStarting}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 text-left"
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.[0]
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
