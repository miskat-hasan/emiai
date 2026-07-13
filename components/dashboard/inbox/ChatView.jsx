"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { ArrowLeft, Video, Gift, Star, X } from "lucide-react";
import { IoIosAttach } from "react-icons/io";
import Modal from "@/components/common/Modal";
import CreateDealModal from "./modals/CreateDealModal";
import AttachmentGrid from "./AttachmentGrid";
import MessageReactions from "./MessageReactions";
import PinnedMessagesBar from "./PinnedMessagesBar";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationSeenMutation,
  chatApi,
  useTogglePinMessageMutation,
} from "@/redux/api/services/chatApi";
import { mapApiMessage } from "./chatMappers";
import { usePresenceChannel } from "@/hooks/useEcho";

const TrophySVG = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C11.172 2 10.5 2.672 10.5 3.5V4H6.5C5.672 4 5 4.672 5 5.5C5 7.985 6.82 10 9.174 10.488C9.678 11.371 10.5 12 11.5 12.374V14H10C8.895 14 8 14.895 8 16V17C8 17.552 8.448 18 9 18H15C15.552 18 16 17.552 16 17V16C16 14.895 15.105 14 14 14H12.5V12.374C13.5 12 14.322 11.371 14.826 10.488C17.18 10 19 7.985 19 5.5C19 4.672 18.328 4 17.5 4H13.5V3.5C13.5 2.672 12.828 2 12 2Z"
      fill="currentColor"
    />
  </svg>
);

function detectMessageType(files) {
  if (files.length > 1) return "multiple";
  const type = files[0]?.type ?? "";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "file";
}

export default function ChatView({ chat, currentUserId, onBack, onOpenInfo }) {
  const dispatch = useDispatch();
  const [openDeal, isOpenDeal] = useState(false);

  const [inputText, setInputText] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [onlineMemberIds, setOnlineMemberIds] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = chat;

  const { data, isLoading } = useGetMessagesQuery(
    { conversationId: chat.id },
    { skip: !chat?.id },
  );

  // Presence channel: who's currently viewing this conversation (drives the
  // online dot), plus the two custom events for live message/conversation
  // updates. Both handlers refetch via invalidateTags rather than patch the
  // socket payload directly into cache — see note above on unknown payload
  // shape. Once confirmed, MessageEvent especially is worth optimistic-patching
  // since it fires most often.
  usePresenceChannel(
    chat?.id ? `conversation.${chat.id}` : null,
    {
      here: members => setOnlineMemberIds(members.map(m => m.id)),
      joining: member =>
        setOnlineMemberIds(prev => [...new Set([...prev, member.id])]),
      leaving: member =>
        setOnlineMemberIds(prev => prev.filter(id => id !== member.id)),
      events: {
        MessageEvent: ({ type, payload }) => {
          console.log("[Echo] MessageEvent:", type, payload);
          if (type === "reaction") {
            dispatch(
              chatApi.util.invalidateTags([{ type: "Messages", id: chat.id }]),
            );
            return;
          }
          if (type === "pinned" || type === "unpinned") {
            dispatch(
              chatApi.util.invalidateTags([
                { type: "PinnedMessages", id: chat.id },
              ]),
            );
            dispatch(
              chatApi.util.invalidateTags([{ type: "Messages", id: chat.id }]),
            );
            return;
          }
          // sent | updated | deleted | deleted_for_everyone | deleted_permanent | delivered | seen
          dispatch(
            chatApi.util.invalidateTags([{ type: "Messages", id: chat.id }]),
          );
          dispatch(
            chatApi.util.invalidateTags([{ type: "Conversation", id: "LIST" }]),
          );
        },
        ConversationEvent: ({ action, conversation }) => {
          console.log("[Echo] ConversationEvent:", action, conversation);
          dispatch(
            chatApi.util.invalidateTags([{ type: "Conversation", id: "LIST" }]),
          );
          if (conversation?.id) {
            dispatch(
              chatApi.util.invalidateTags([
                { type: "Messages", id: conversation.id },
              ]),
            );
          }
        },
      },
    },
    [chat?.id],
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markSeen] = useMarkConversationSeenMutation();
  const [togglePin] = useTogglePinMessageMutation();

  const handleTogglePin = async messageId => {
    try {
      await togglePin({ messageId, conversationId: chat.id }).unwrap();
    } catch {
      // silent
    }
  };

  const messages = (data?.data ?? []).map(mapApiMessage).reverse();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (chat?.id) markSeen(chat.id);
  }, [chat?.id, markSeen]);

  const handleFileSelect = e => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const removePendingFile = index => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputText.trim() && pendingFiles.length === 0) return;

    const fd = new FormData();
    fd.append("conversation_id", chat.id);
    if (chat.type !== "group" && user?.id) {
      fd.append("receiver_id", user.id);
    }
    fd.append("message", inputText.trim());
    fd.append(
      "message_type",
      pendingFiles.length > 0 ? detectMessageType(pendingFiles) : "text",
    );
    pendingFiles.forEach((file, i) => {
      fd.append(`attachments[${i}][path]`, file);
    });

    try {
      await sendMessage(fd).unwrap();
      setInputText("");
      setPendingFiles([]);
    } catch {
      // RTK Query error — the input stays populated so nothing is lost.
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-3 m-3">
        <div className="flex flex-col flex-1 bg-white rounded-[24px] overflow-hidden border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-gray-50/50">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>

              <div className="relative">
                {user.avatar.length > 2 ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image
                      src={user.avatar}
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
                {(user.isOnline || onlineMemberIds.includes(user.id)) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <button
                onClick={onOpenInfo}
                className="font-bold text-gray-900 text-[15px] hover:text-primary transition-colors cursor-pointer text-left"
              >
                {user.name}
              </button>
            </div>

            <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-[0_4px_10px_rgba(239,68,68,0.2)]">
              <Video size={18} />
            </button>
          </div>

          <PinnedMessagesBar conversationId={chat.id} />
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {isLoading && (
              <p className="text-center text-xs text-gray-400">
                Loading messages...
              </p>
            )}

            {messages.map(msg => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isSelf = msg.isSelf;
              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isSelf ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex flex-col ${isSelf ? "items-end" : "items-start"} max-w-[85%]`}
                  >
                    <div
                      className={`flex items-start gap-3 w-full ${isSelf ? "flex-row-reverse justify-start" : "flex-row"}`}
                    >
                      {!isSelf && (
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#125B50] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {user.avatar.length > 2
                              ? user.name?.[0]
                              : user.avatar}
                          </div>
                        </div>
                      )}

                      <div
                        className={`
                      flex flex-col min-w-[280px] max-w-[85%]
                      ${
                        isSelf
                          ? "bg-[#F9F9F9] rounded-[24px] rounded-tr-md border border-gray-100/60"
                          : "bg-gradient-to-b from-white via-white to-primary/10 rounded-[24px] rounded-tl-md border border-gray-50"
                      }
                    `}
                      >
                        <div
                          className={`flex items-start justify-between px-5 pt-4 pb-4 gap-4 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {msg.text && (
                            <p className="text-[15px] text-gray-600 leading-relaxed font-medium whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                          )}
                          <button
                            onClick={() => handleTogglePin(msg.id)}
                            className="shrink-0 mt-0.5 cursor-pointer"
                            aria-label={
                              msg.isPinned ? "Unpin message" : "Pin message"
                            }
                          >
                            <Star
                              size={20}
                              className={
                                msg.isPinned
                                  ? "text-primary fill-primary"
                                  : "text-gray-300 hover:text-gray-400"
                              }
                              strokeWidth={1.5}
                            />
                          </button>
                        </div>

                        <AttachmentGrid attachments={msg.attachments} />

                        <div
                          className={`flex px-5 pb-4 ${isSelf ? "justify-start" : "justify-end"}`}
                        >
                          <span className="text-[14px] text-gray-500 font-medium">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <MessageReactions
                      messageId={msg.id}
                      conversationId={chat.id}
                      reactions={msg.reactions}
                      isSelf={isSelf}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 mt-auto w-full">
          <div className="flex flex-col bg-gradient-to-br from-[#FCFCFC] to-primary/10 border border-gray-200/80 rounded-[24px] p-5 shadow-sm">
            {pendingFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {pendingFiles.map((file, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700"
                  >
                    {file.name}
                    <button
                      onClick={() => removePendingFile(i)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type something.."
              rows={2}
              className="w-full bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-400 px-1 py-1 resize-none mb-6"
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => isOpenDeal(true)}
                  className="bg-linear-to-r from-primary to-secondary text-white p-2.5 rounded-[14px] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <Gift size={20} strokeWidth={2} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="*:text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <IoIosAttach size={20} strokeWidth={2} />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                  <TrophySVG />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={
                  (!inputText.trim() && pendingFiles.length === 0) || isSending
                }
                className="bg-gradient-to-r from-primary to-secondary text-white px-7 py-3 rounded-[14px] text-[15px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/25"
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openDeal}
        onClose={() => isOpenDeal(false)}
        className="max-w-xl"
      >
        <CreateDealModal
          targetId={user?.id}
          onClose={() => isOpenDeal(false)}
        />
      </Modal>
    </>
  );
}
