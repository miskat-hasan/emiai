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
import NewChatModal from "./modals/NewChatModal";

// Mobile shows exactly one of these full-width at a time.
// Desktop (lg+) always shows sidebar + list, and chat/info in the remaining space.
const PANEL = { SIDEBAR: "sidebar", LIST: "list", CHAT: "chat", INFO: "info" };

export default function InboxPage({ role }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobilePanel, setMobilePanel] = useState(PANEL.SIDEBAR);

  const [chatListWidth, setChatListWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const startDragX = useRef(0);
  const startWidth = useRef(0);

  const currentUserId = useSelector(state => state.auth?.user?.id);

  const { data, isLoading } = useGetConversationsQuery();

  usePrivateChannel(
    currentUserId ? `user.${currentUserId}` : null,
    {
      ConversationEvent: () => {
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
      setChatListWidth(
        Math.min(Math.max(startWidth.current + deltaX, 280), 500),
      );
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
    if (activeTab === "saved") list = list.filter(c => c.isStarred);
    else if (activeTab === "unread") list = list.filter(c => c.unreadCount > 0);
    else if (activeTab === "group") list = list.filter(c => c.type === "group");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.user.name.toLowerCase().includes(q));
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

  const handleSelectTab = tabId => {
    setActiveTab(tabId);
    setMobilePanel(PANEL.LIST); // mobile: tapping a sidebar tab moves to the list panel
  };

  const handleSelectChat = id => {
    setSelectedChatId(id);
    setMobilePanel(PANEL.CHAT);
  };

  const handleConversationDeleted = () => {
    setSelectedChatId(null);
    setMobilePanel(PANEL.LIST);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex overflow-hidden relative lg:gap-0 lg:p-0">
        {/* Sidebar */}
        <div
          className={`
            ${mobilePanel === PANEL.SIDEBAR ? "flex" : "hidden"} lg:flex
            w-full lg:w-auto shrink-0 flex-col overflow-y-auto scrollbar-hide p-3 lg:p-0
          `}
        >
          <InboxSidebar
            activeTab={activeTab}
            setActiveTab={handleSelectTab}
            counts={counts}
            onCreateGroup={() => setCreateGroupOpen(true)}
          />
        </div>

        {/* Chat list */}
        <div
          className={`
            ${mobilePanel === PANEL.LIST ? "flex" : "hidden"} lg:flex
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
            onNewChat={() => setNewChatOpen(true)}
            onBack={() => setMobilePanel(PANEL.SIDEBAR)}
            onConversationDeleted={handleConversationDeleted}
            isLoading={isLoading}
          />
        </div>

        <div
          className={`
            hidden lg:flex w-1 bg-gray-200 hover:bg-primary/50 active:bg-primary shrink-0 cursor-col-resize transition-colors
            ${isDragging ? "bg-primary" : ""}
          `}
          onMouseDown={handleMouseDown}
        />

        {/* Chat / info panel */}
        <div
          className={`
            ${mobilePanel === PANEL.CHAT || mobilePanel === PANEL.INFO ? "flex" : "hidden"} lg:flex
            w-full lg:w-auto lg:flex-1 flex-col overflow-hidden p-2
          `}
        >
          {selectedChat ? (
            mobilePanel === PANEL.INFO ? (
              <ChatInfoView
                chat={selectedChat}
                currentUserId={currentUserId}
                onBack={() => setMobilePanel(PANEL.CHAT)}
              />
            ) : (
              <ChatView
                chat={selectedChat}
                currentUserId={currentUserId}
                onBack={() => setMobilePanel(PANEL.LIST)}
                onOpenInfo={() => setMobilePanel(PANEL.INFO)}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center bg-orange-50/20 rounded-2xl">
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
        onCreated={conversation =>
          conversation?.id && handleSelectChat(conversation.id)
        }
      />

      <NewChatModal
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onStarted={conversation =>
          conversation?.id && handleSelectChat(conversation.id)
        }
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
