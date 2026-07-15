// components/dashboard/inbox/ChatView.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import {
  ArrowLeft,
  Video,
  Gift,
  Star,
  X,
  Send,
  FileText,
  Reply,
  Search,
} from "lucide-react";
import { IoIosAttach } from "react-icons/io";
import Modal from "@/components/common/Modal";
import CreateDealModal from "./modals/CreateDealModal";
import AttachmentGrid from "./AttachmentGrid";
import MessageReactions from "./MessageReactions";
import PinnedMessagesBar from "./PinnedMessagesBar";
import MessageActionsMenu from "./MessageActionsMenu";
import ForwardMessageModal from "./modals/ForwardMessageModal";
import MessageSearchBar from "./MessageSearchBar";
import MessagesSkeleton from "./MessagesSkeleton";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationSeenMutation,
  useEditMessageMutation,
  chatApi,
  useTogglePinMessageMutation,
} from "@/redux/api/services/chatApi";
import { mapApiMessage } from "./chatMappers";
import { usePresenceChannel } from "@/hooks/useEcho";
import { useMarkMessagesSeenOnView } from "@/hooks/useMarkMessagesSeenOnView";
import MessageStatusTicks from "./MessageStatusTicks";

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
  const [previewUrls, setPreviewUrls] = useState([]);
  const [onlineMemberIds, setOnlineMemberIds] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messageRefs = useRef({});
  const { user } = chat;

  const observeForSeen = useMarkMessagesSeenOnView(chat?.id);

  const { data, isLoading, isError, refetch } = useGetMessagesQuery(
    { conversationId: chat.id },
    { skip: !chat?.id },
  );

  usePresenceChannel(
    chat?.id ? `conversation.${chat.id}` : null,
    {
      here: members => setOnlineMemberIds(members.map(m => m.id)),
      joining: member =>
        setOnlineMemberIds(prev => [...new Set([...prev, member.id])]),
      leaving: member =>
        setOnlineMemberIds(prev => prev.filter(id => id !== member.id)),
      events: {
        MessageEvent: ({ type }) => {
          if (type === "pinned" || type === "unpinned") {
            dispatch(
              chatApi.util.invalidateTags([
                { type: "PinnedMessages", id: chat.id },
              ]),
            );
          }
          dispatch(
            chatApi.util.invalidateTags([{ type: "Messages", id: chat.id }]),
          );
          dispatch(
            chatApi.util.invalidateTags([{ type: "Conversation", id: "LIST" }]),
          );
        },
        ConversationEvent: ({ conversation }) => {
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
  const [editMessage] = useEditMessageMutation();
  const [markSeen] = useMarkConversationSeenMutation();
  const [togglePin] = useTogglePinMessageMutation();

  const messages = (data?.data ?? []).map(mapApiMessage).reverse();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (chat?.id) markSeen(chat.id);
  }, [chat?.id, markSeen]);

  // Generate/revoke thumbnail preview URLs as pendingFiles change
  useEffect(() => {
    const urls = pendingFiles.map(file => ({
      file,
      url:
        file.type.startsWith("image/") || file.type.startsWith("video/")
          ? URL.createObjectURL(file)
          : null,
    }));
    setPreviewUrls(urls);
    return () => urls.forEach(u => u.url && URL.revokeObjectURL(u.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFiles]);

  // Auto-grow textarea instead of a fixed tall box
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [inputText]);

  const handleFileSelect = e => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const removePendingFile = index => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleReply = msg => {
    setEditingMessage(null);
    setReplyTo(msg);
    textareaRef.current?.focus();
  };

  const handleEdit = msg => {
    setReplyTo(null);
    setEditingMessage(msg);
    setInputText(msg.text ?? "");
    textareaRef.current?.focus();
  };

  const handleJumpToMessage = messageId => {
    if (!messageId) return;
    const el = messageRefs.current[messageId];
    if (!el) {
      // Messages are paginated (GET /api/messages/:id?page=), so a pinned
      // or searched message earlier in history may not be in the currently
      // loaded page. Being honest about this rather than silently failing.
      toast.info(
        "This message is further back — scroll up to load more history.",
      );
      return;
    }
    setHighlightedId(messageId);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(
      () => setHighlightedId(id => (id === messageId ? null : id)),
      1800,
    );
  };

  const handleTogglePin = async messageId => {
    try {
      await togglePin({ messageId, conversationId: chat.id }).unwrap();
    } catch {
      // silent
    }
  };

  const handleSend = async () => {
    if (editingMessage) {
      if (!inputText.trim()) return;
      try {
        await editMessage({
          messageId: editingMessage.id,
          message: inputText.trim(),
          conversationId: chat.id,
        }).unwrap();
        setEditingMessage(null);
        setInputText("");
      } catch {
        // stays populated on failure
      }
      return;
    }

    if (!inputText.trim() && pendingFiles.length === 0) return;

    const fd = new FormData();
    fd.append("conversation_id", chat.id);
    if (chat.type !== "group" && user?.id) fd.append("receiver_id", user.id);
    fd.append("message", inputText.trim());
    fd.append(
      "message_type",
      pendingFiles.length > 0 ? detectMessageType(pendingFiles) : "text",
    );
    if (replyTo) fd.append("reply_to_message_id", replyTo.id);
    pendingFiles.forEach((file, i) =>
      fd.append(`attachments[${i}][path]`, file),
    );

    try {
      await sendMessage(fd).unwrap();
      setInputText("");
      setPendingFiles([]);
      setReplyTo(null);
    } catch {
      // input stays populated
    }
  };

  const cancelComposerContext = () => {
    setReplyTo(null);
    setEditingMessage(null);
    setInputText("");
  };

  return (
    <>
      <div className="flex flex-col h-full gap-2 min-h-0">
        <div className="flex flex-col flex-1 bg-white rounded-[20px] overflow-hidden border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 shrink-0 border-b border-gray-50/50">
            <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
              <button
                onClick={onBack}
                className="lg:hidden w-8 h-8 shrink-0 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>

              <div className="relative shrink-0">
                {user.avatar.length > 2 ? (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#125B50] text-white flex items-center justify-center font-bold text-sm">
                    {user.avatar}
                  </div>
                )}
                {(user.isOnline || onlineMemberIds.includes(user.id)) && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <button
                onClick={onOpenInfo}
                className="font-bold text-gray-900 text-sm md:text-[15px] hover:text-primary transition-colors cursor-pointer text-left truncate"
              >
                {user.name}
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  searchOpen
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Search size={16} />
              </button>
              <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-[0_4px_10px_rgba(239,68,68,0.2)]">
                <Video size={16} />
              </button>
            </div>
          </div>
          <MessageSearchBar
            conversationId={chat.id}
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            onJumpToMessage={handleJumpToMessage}
          />

          <PinnedMessagesBar
            conversationId={chat.id}
            onJumpToMessage={handleJumpToMessage}
          />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {isLoading && <MessagesSkeleton />}

            {isError && !isLoading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <p className="text-sm text-gray-400">Couldn't load messages.</p>
                <button
                  onClick={refetch}
                  className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Try again
                </button>
              </div>
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
                  data-message-id={msg.id}
                  data-is-mine={msg.isSelf}
                  ref={el => {
                    messageRefs.current[msg.id] = el;
                    observeForSeen(el);
                  }}
                  className={`group/msg flex w-full transition-colors duration-500 rounded-2xl ${isSelf ? "justify-end" : "justify-start"} ${
                    highlightedId === msg.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div
                    className={`flex flex-col ${isSelf ? "items-start" : "items-end"} max-w-[92%] md:max-w-[85%]`}
                  >
                    <div
                      className={`flex items-start gap-2 md:gap-3 w-full ${isSelf ? "flex-row-reverse justify-start" : "flex-row"}`}
                    >
                      {!isSelf && (
                        <div className="shrink-0">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#125B50] text-white flex items-center justify-center font-bold text-xs md:text-sm shadow-sm">
                            {user.avatar.length > 2
                              ? user.name?.[0]
                              : user.avatar}
                          </div>
                        </div>
                      )}

                      {/* Hover action row */}
                      <div
                        className={`flex items-center gap-0.5 opacity-0 group-hover/msg:opacity-100 transition-opacity shrink-0 self-center ${isSelf ? "order-first" : "order-last"}`}
                      >
                        <button
                          onClick={() => handleReply(msg)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <Reply size={14} />
                        </button>
                        <MessageActionsMenu
                          message={msg}
                          conversationId={chat.id}
                          isSelf={isSelf}
                          onEdit={() => handleEdit(msg)}
                          onForward={() => setForwardMessage(msg)}
                        />
                      </div>

                      <div
                        className={`
                          flex flex-col min-w-[200px] md:min-w-[280px] max-w-full
                          ${
                            isSelf
                              ? "bg-[#F9F9F9] rounded-[18px] rounded-tr-md border border-gray-100/60"
                              : "bg-gradient-to-b from-white via-white to-primary/10 rounded-[18px] rounded-tl-md border border-gray-50"
                          }
                        `}
                      >
                        {msg.replyTo && (
                          <div
                            className={`mx-4 mt-3 px-3 py-2 rounded-lg bg-black/5 border-l-2 border-primary text-xs ${isSelf ? "text-right" : ""}`}
                          >
                            <p className="font-semibold text-gray-600">
                              {msg.replyTo.sender?.name}
                            </p>
                            <p className="text-gray-400 truncate">
                              {msg.replyTo.message ?? `[${msg.replyTo.type}]`}
                            </p>
                          </div>
                        )}

                        <div
                          className={`flex items-start justify-between px-4 md:px-5 pt-3 md:pt-4 pb-3 md:pb-4 gap-3 md:gap-4 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {msg.text && (
                            <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed font-medium whitespace-pre-wrap break-words">
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
                              size={18}
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
                          className={`flex px-4 md:px-5 pb-3 md:pb-4 ${isSelf ? "justify-start" : "justify-end"}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs md:text-[14px] text-gray-500 font-medium">
                              {msg.timestamp}
                            </span>
                            {msg.isEdited && (
                              <span className="text-[11px] text-gray-400 italic">
                                · Edited
                              </span>
                            )}
                            {isSelf && chat.type !== "group" && (
                              <MessageStatusTicks statuses={msg.statuses} />
                            )}
                          </div>
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

        {/* Composer — compact, thumbnail previews, reply/edit context bar */}
        <div className="shrink-0 w-full">
          <div className="flex flex-col bg-gradient-to-br from-[#FCFCFC] to-primary/10 border border-gray-200/80 rounded-[18px] p-2.5 md:p-3 shadow-sm">
            {(replyTo || editingMessage) && (
              <div className="flex items-center justify-between bg-white/70 border-l-2 border-primary rounded-lg px-3 py-1.5 mb-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-primary">
                    {editingMessage
                      ? "Editing message"
                      : `Replying to ${replyTo.senderName || user.name}`}
                  </p>
                  {!editingMessage && (
                    <p className="text-xs text-gray-500 truncate">
                      {replyTo.text || `[${replyTo.messageType}]`}
                    </p>
                  )}
                </div>
                <button
                  onClick={cancelComposerContext}
                  className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0 p-1"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {previewUrls.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {previewUrls.map((p, i) => (
                  <div
                    key={i}
                    className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    {p.file.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : p.file.type.startsWith("video/") ? (
                      <video
                        src={p.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-1">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-[8px] text-gray-400 truncate w-full text-center">
                          {p.file.name}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removePendingFile(i)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type something.."
                rows={1}
                className="flex-1 bg-transparent outline-none text-sm md:text-[15px] text-gray-800 placeholder:text-gray-400 px-2 py-2 resize-none max-h-[120px]"
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                  if (e.key === "Escape" && (replyTo || editingMessage))
                    cancelComposerContext();
                }}
              />

              <div className="flex items-center gap-1.5 md:gap-2 shrink-0 pb-1">
                {!editingMessage && (
                  <>
                    <button
                      onClick={() => isOpenDeal(true)}
                      className="bg-linear-to-r from-primary to-secondary text-white p-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                    >
                      <Gift size={16} strokeWidth={2} />
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
                      className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer p-2"
                    >
                      <IoIosAttach size={18} strokeWidth={2} />
                    </button>
                  </>
                )}
                <button
                  onClick={handleSend}
                  disabled={
                    (!inputText.trim() && pendingFiles.length === 0) ||
                    isSending
                  }
                  className="bg-gradient-to-r from-primary to-secondary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/25"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
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

      <ForwardMessageModal
        message={forwardMessage}
        open={!!forwardMessage}
        onClose={() => setForwardMessage(null)}
      />
    </>
  );
}
