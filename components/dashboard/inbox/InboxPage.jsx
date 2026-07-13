"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import InboxSidebar from "./InboxSidebar";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import ChatInfoView from "./ChatInfoView";
import { Mail } from "lucide-react";
import {
  useGetConversationsQuery,
  chatApi,
} from "@/redux/api/services/chatApi";
import { mapConversationToChat } from "./chatMappers";
import { usePrivateChannel } from "@/hooks/useEcho";
import CreateGroupModal from "./modals/CreateGroupModal";
import FilterModal from "./modals/FilterModal";

export default function InboxPage({ role }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [showChatViewOnMobile, setShowChatViewOnMobile] = useState(false);
  const [showInfoView, setShowInfoView] = useState(false);

  const [chatListWidth, setChatListWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const startDragX = useRef(0);
  const startWidth = useRef(0);

  const currentUserId = useSelector(state => state.auth?.user?.id);

  const { data, isLoading } = useGetConversationsQuery();
  console.log(data)

  // ConversationEvent broadcasts here whenever the backend targets this
  // user specifically (new group added, new DM, etc.) — refetch the list
  // rather than guess at the payload shape.
  usePrivateChannel(
    currentUserId ? `user.${currentUserId}` : null,
    {
      ConversationEvent: ({ action, conversation }) => {
        console.log(
          "[Echo] user-channel ConversationEvent:",
          action,
          conversation,
        );
        dispatch(
          chatApi.util.invalidateTags([{ type: "Conversation", id: "LIST" }]),
        );
      },
    },
    [currentUserId],
  );

  const chats = useMemo(
    () => (data?.data ?? []).map(mapConversationToChat),
    [data],
  );

  const handleMouseDown = e => {
    e.preventDefault();
    startDragX.current = e.clientX;
    startWidth.current = chatListWidth;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = e => {
      const deltaX = e.clientX - startDragX.current;
      const newWidth = startWidth.current + deltaX;
      setChatListWidth(Math.min(Math.max(newWidth, 280), 500));
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const filteredChats = useMemo(() => {
    let list = chats;

    if (activeTab === "saved") {
      list = list.filter(c => c.isStarred);
    } else if (activeTab === "unread") {
      list = list.filter(c => c.unreadCount > 0);
    } else if (activeTab === "group") {
      list = list.filter(c => c.type === "group");
    }
    // "inbox" shows everything

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(c => c.user.name.toLowerCase().includes(query));
    }
    if (activeFilter === "online") list = list.filter(c => c.user.isOnline);
    if (activeFilter === "blocked") list = list.filter(c => c.isBlocked);
    if (activeFilter === "muted") list = list.filter(c => c.isMuted);

    return list;
  }, [chats, activeTab, searchQuery, activeFilter]);

  const counts = useMemo(
    () => ({
      inbox: chats.reduce((acc, c) => acc + c.unreadCount, 0),
      unread: chats.filter(c => c.unreadCount > 0).length,
      group: chats.filter(c => c.type === "group").length,
    }),
    [chats],
  );

  const selectedChat = useMemo(
    () => chats.find(c => c.id === selectedChatId) || null,
    [chats, selectedChatId],
  );

  const handleSelectChat = id => {
    if (selectedChatId !== id) {
      setShowInfoView(false);
    }
    setSelectedChatId(id);
    setShowChatViewOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatViewOnMobile(false);
    setShowInfoView(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      <div
        className={`mb-6 shrink-0 ${showChatViewOnMobile ? "hidden lg:block" : "block"}`}
      >
        <h1 className="text-2xl font-bold text-black">Inbox</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Inbox</span>
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden relative lg:p-0">
        <div
          className={`
          ${showChatViewOnMobile ? "hidden lg:flex" : "flex"}
          w-full lg:w-auto shrink-0 flex-col overflow-y-auto scrollbar-hide
        `}
        >
          <InboxSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={counts}
            onCreateGroup={() => setCreateGroupOpen(true)}
          />
        </div>

        <div
          className={`
            ${showChatViewOnMobile ? "hidden lg:flex" : "flex"}
            w-full lg:w-[var(--chat-list-width)] shrink-0 flex-col overflow-hidden
          `}
          style={{ "--chat-list-width": `${chatListWidth}px` }}
        >
          <ChatList
            chats={filteredChats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenFilter={() => setFilterModalOpen(true)}
          />
          {isLoading && (
            <p className="text-center text-xs text-gray-400 py-4">
              Loading conversations...
            </p>
          )}
        </div>

        <div
          className={`
            hidden lg:flex w-1 bg-gray-200 hover:bg-primary/50 active:bg-primary shrink-0 cursor-col-resize transition-colors
            ${isDragging ? "bg-primary" : ""}
          `}
          onMouseDown={handleMouseDown}
        />

        <div
          className={`
          ${!showChatViewOnMobile && !selectedChatId ? "hidden lg:flex" : "flex"}
          w-full lg:w-auto lg:flex-1 flex-col overflow-hidden
        `}
        >
          {selectedChat ? (
            showInfoView ? (
              <ChatInfoView
                chat={selectedChat}
                currentUserId={currentUserId}
                onBack={() => setShowInfoView(false)}
              />
            ) : (
              <ChatView
                chat={selectedChat}
                currentUserId={currentUserId}
                onBack={handleBackToList}
                onOpenInfo={() => setShowInfoView(true)}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center bg-orange-50/20">
              <div className="flex flex-col items-center text-gray-300">
                <Mail
                  size={64}
                  className="mb-4 opacity-40 text-primary"
                  strokeWidth={1}
                />
                <p className="font-medium text-gray-500">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateGroupModal
        open={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreated={conversation => {
          if (conversation?.id) handleSelectChat(conversation.id);
        }}
      />

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        activeFilter={activeFilter}
        onApply={setActiveFilter}
      />
    </div>
  );
}
