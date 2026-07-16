"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import {
  ArrowLeft,
  Video,
  Gift,
  X,
  Send,
  FileText,
  Reply,
  Search,
  Pin,
  MoreHorizontal,
} from "lucide-react";
import { IoIosAttach } from "react-icons/io";
import Modal from "@/components/common/Modal";
import CreateDealModal from "./modals/CreateDealModal";
import AttachmentGrid from "./AttachmentGrid";
import ReactionPills from "./ReactionPills";
import AddReactionButton from "./AddReactionButton";
import LinkifiedText from "./LinkifiedText";
import PinnedMessagesBar from "./PinnedMessagesBar";
import MessageActionsMenu from "./MessageActionsMenu";
import ForwardMessageModal from "./modals/ForwardMessageModal";
import MessageSearchBar from "./MessageSearchBar";
import MessagesSkeleton from "./MessagesSkeleton";
import MessageStatusTicks from "./MessageStatusTicks";
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
import { toast } from "react-toastify";

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
  const [activeMessageId, setActiveMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
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
    if (!chat?.id) return;
    if (document.visibilityState !== "visible") return;
    markSeen(chat.id);
  }, [chat?.id, messages.length, markSeen]);

  useEffect(() => {
    const handleFocus = () => {
      if (chat?.id) markSeen(chat.id);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [chat?.id, markSeen]);

  useEffect(() => {
    const handler = e => {
      if (
        messagesContainerRef.current &&
        !messagesContainerRef.current.contains(e.target)
      ) {
        setActiveMessageId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        <div className="flex flex-col flex-1 bg-white rounded-[22px] overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3.5 shrink-0 border-b border-gray-50">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onBack}
                className="lg:hidden w-8 h-8 shrink-0 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>

              <div className="relative shrink-0">
                {user.avatar.length > 2 ? (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden relative ring-2 ring-white shadow-sm">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.avatar}
                  </div>
                )}
                {(user.isOnline || onlineMemberIds.includes(user.id)) && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-[2.5px] border-white rounded-full" />
                )}
              </div>
              <div className="min-w-0">
                <button
                  onClick={onOpenInfo}
                  className="font-semibold text-gray-900 text-sm md:text-[15px] hover:text-primary transition-colors cursor-pointer text-left truncate block"
                >
                  {user.name}
                </button>
                {(user.isOnline || onlineMemberIds.includes(user.id)) && (
                  <span className="text-[11px] text-green-600 font-medium">
                    Online
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  searchOpen
                    ? "bg-primary/10 text-primary"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <Search size={16} />
              </button>
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm">
                <Video size={15} />
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
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-3.5 md:gap-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent bg-[radial-gradient(circle_at_top_right,rgba(240,90,40,0.03),transparent_45%)]"
          >
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
                    <span className="text-[11px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isSelf = msg.isSelf;
              const isActive = activeMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  data-message-id={msg.id}
                  data-is-mine={msg.isSelf}
                  ref={el => {
                    messageRefs.current[msg.id] = el;
                    observeForSeen(el);
                  }}
                  onClick={() =>
                    setActiveMessageId(prev =>
                      prev === msg.id ? null : msg.id,
                    )
                  }
                  className={`group/msg flex w-full transition-colors duration-500 rounded-2xl cursor-pointer ${
                    isSelf ? "justify-end" : "justify-start"
                  } ${highlightedId === msg.id ? "bg-primary/[0.06]" : ""}`}
                >
                  <div
                    className={`flex flex-col ${isSelf ? "items-end" : "items-start"} max-w-[88%] md:max-w-[72%]`}
                  >
                    <div
                      className={`flex items-end gap-2 w-full ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!isSelf && (
                        <div className="shrink-0 mb-0.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                            {user.avatar.length > 2
                              ? user.name?.[0]
                              : user.avatar}
                          </div>
                        </div>
                      )}

                      {/* Floating toolbar — appears above the bubble on hover/tap */}
                      <div className="flex flex-col items-center">
                        <div
                          onClick={e => e.stopPropagation()}
                          className={`
                            flex items-center gap-0.5 mb-1.5 bg-white rounded-full shadow-md border border-gray-100 px-1 py-1
                            transition-all duration-150
                            ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none group-hover/msg:opacity-100 group-hover/msg:translate-y-0 group-hover/msg:pointer-events-auto"}
                          `}
                        >
                          <AddReactionButton
                            messageId={msg.id}
                            conversationId={chat.id}
                            isSelf={isSelf}
                            compact
                          />
                          <button
                            onClick={() => handleReply(msg)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <Reply size={13} />
                          </button>
                          <MessageActionsMenu
                            message={msg}
                            conversationId={chat.id}
                            isSelf={isSelf}
                            onEdit={() => handleEdit(msg)}
                            onForward={() => setForwardMessage(msg)}
                            onReply={() => handleReply(msg)}
                            onTogglePin={() => handleTogglePin(msg.id)}
                            trigger={
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                                <MoreHorizontal size={14} />
                              </div>
                            }
                          />
                        </div>

                        <div
                          className={`
                            flex flex-col
                            ${
                              isSelf
                                ? "bg-gradient-to-br from-primary to-secondary text-white rounded-[20px] rounded-br-md shadow-sm shadow-primary/20"
                                : "bg-white text-gray-800 rounded-[20px] rounded-bl-md border border-gray-100 shadow-sm"
                            }
                          `}
                        >
                          {msg.replyTo && (
                            <div
                              className={`mx-3.5 mt-3 px-3 py-2 rounded-xl text-xs border-l-2 ${
                                isSelf
                                  ? "bg-white/15 border-white/50"
                                  : "bg-gray-50 border-primary"
                              }`}
                            >
                              <p
                                className={`font-semibold ${isSelf ? "text-white/90" : "text-gray-600"}`}
                              >
                                {msg.replyTo.sender?.name}
                              </p>
                              <p
                                className={`truncate ${isSelf ? "text-white/70" : "text-gray-400"}`}
                              >
                                {msg.replyTo.message ?? `[${msg.replyTo.type}]`}
                              </p>
                            </div>
                          )}

                          {msg.text && (
                            <div className="px-3.5 md:px-4 pt-2.5 pb-1.5">
                              <LinkifiedText
                                text={msg.text}
                                isSelf={isSelf}
                                className={`text-sm leading-relaxed break-words ${isSelf ? "text-white" : "text-gray-700"}`}
                              />
                            </div>
                          )}

                          <AttachmentGrid attachments={msg.attachments} />

                          {/* pinned, time, message status (seen, unseen) */}
                          <div
                            className={`flex items-center justify-end pb-2 ${isSelf ? "flex-row-reverse" : ""}`}
                          >
                            {msg.isPinned && (
                              <div
                                className={`flex items-center gap-1 ${isSelf ? "pr-3.5 md:pr-4" : "pl-3.5 md:pl-4"}`}
                              >
                                <Pin
                                  size={11}
                                  className={
                                    isSelf
                                      ? "text-white/70 fill-white/70"
                                      : "text-primary fill-primary"
                                  }
                                />
                                <span
                                  className={`text-[10px] ${isSelf ? "text-white/70" : "text-primary"}`}
                                >
                                  Pinned
                                </span>
                              </div>
                            )}
                            <div
                              className={`flex items-center gap-1.5 px-3.5 md:px-4 ${isSelf ? "justify-start" : "justify-end"}`}
                            >
                              {isSelf && chat.type !== "group" && (
                                <MessageStatusTicks
                                  statuses={msg.statuses}
                                  light
                                />
                              )}

                              <span
                                className={`text-[10.5px] font-medium ${isSelf ? "text-white/70" : "text-gray-400"}`}
                              >
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={e => e.stopPropagation()}
                      className={`px-1 ${isSelf ? "self-end" : "self-start ml-9"}`}
                    >
                      <ReactionPills
                        messageId={msg.id}
                        conversationId={chat.id}
                        reactions={msg.reactions}
                        isSelf={isSelf}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 w-full">
          {(replyTo || editingMessage) && (
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-t-2xl px-4 py-2 -mb-1 shadow-sm">
              <div className="min-w-0 flex items-center gap-2">
                <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
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
              </div>
              <button
                onClick={cancelComposerContext}
                className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0 p-1.5"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 bg-white border border-gray-100 rounded-[24px] p-2 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            {!editingMessage && (
              <>
                <button
                  onClick={() => isOpenDeal(true)}
                  className="shrink-0 bg-gradient-to-br from-primary to-secondary text-white w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <Gift size={15} strokeWidth={2} />
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
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <IoIosAttach size={19} strokeWidth={2} />
                </button>
              </>
            )}

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {previewUrls.length > 0 && (
                <div className="flex gap-2 mb-1.5 overflow-x-auto pb-1 pt-1">
                  {previewUrls.map((p, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
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
                        <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 px-1">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-[7px] text-gray-400 truncate w-full text-center">
                            {p.file.name}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => removePendingFile(i)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 px-1.5 py-1.5 resize-none max-h-[100px]"
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                  if (e.key === "Escape" && (replyTo || editingMessage))
                    cancelComposerContext();
                }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={
                (!inputText.trim() && pendingFiles.length === 0) || isSending
              }
              className="shrink-0 bg-gradient-to-br from-primary to-secondary text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-primary/25"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
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
