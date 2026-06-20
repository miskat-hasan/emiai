"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import InboxSidebar from "./components/InboxSidebar";
import ChatList from "./components/ChatList";
import ChatView from "./components/ChatView";
import ChatInfoView from "./components/ChatInfoView";
import { MOCK_CHATS, MOCK_MESSAGES } from "./mockData";
import { Mail } from "lucide-react";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Responsive state for mobile view
  const [showChatViewOnMobile, setShowChatViewOnMobile] = useState(false);
  const [showInfoView, setShowInfoView] = useState(false);

  // Resizable Chat List
  const [chatListWidth, setChatListWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const startDragX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDragX.current = e.clientX;
    startWidth.current = chatListWidth;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startDragX.current;
      const newWidth = startWidth.current + deltaX;
      setChatListWidth(Math.min(Math.max(newWidth, 280), 500)); // Clamp between 280px and 500px
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    // Add user-select none to body while dragging to prevent text selection
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Filter chats based on active tab and search query
  const filteredChats = useMemo(() => {
    let chats = MOCK_CHATS;

    // Filter by tab
    if (activeTab === "saved") {
      chats = chats.filter(c => c.isStarred);
    } else {
      chats = chats.filter(c => c.folder === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      chats = chats.filter(c => c.user.name.toLowerCase().includes(query));
    }

    return chats;
  }, [activeTab, searchQuery]);

  // Derived counts for sidebar
  const counts = useMemo(() => {
    return {
      inbox: MOCK_CHATS.filter(c => c.folder === "inbox").reduce((acc, c) => acc + c.unreadCount, 0) || 10, // Mocked 10 for visual match with Figma
      unread: MOCK_CHATS.filter(c => c.folder === "unread").length || 1,
      group: MOCK_CHATS.filter(c => c.folder === "group").length || 1,
    };
  }, []);

  const selectedChat = useMemo(() => {
    return MOCK_CHATS.find(c => c.id === selectedChatId) || null;
  }, [selectedChatId]);

  const messages = useMemo(() => {
    return selectedChatId ? MOCK_MESSAGES[selectedChatId] || [] : [];
  }, [selectedChatId]);

  const handleSelectChat = (id) => {
    if (selectedChatId !== id) {
      setShowInfoView(false); // Reset info view when switching chats
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
      {/* Page Heading - only show on larger screens or when list is visible */}
      <div className={`mb-6 shrink-0 ${showChatViewOnMobile ? 'hidden lg:block' : 'block'}`}>
        <h1 className="text-2xl font-bold text-black">Inbox</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Inbox</span>
        </p>
      </div>

      {/* Main 3-pane layout */}
      <div className="flex-1 flex overflow-hidden relative lg:p-0">

        {/* Panel 1: Sidebar (Hidden on mobile if chat view is active) */}
        <div className={`
          ${showChatViewOnMobile ? 'hidden lg:flex' : 'flex'}
          w-full lg:w-auto shrink-0 flex-col overflow-y-auto scrollbar-hide
        `}>
          <InboxSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={counts}
          />
        </div>

        {/* Panel 2: Chat List (Hidden on mobile if chat view is active) */}
        <div 
          className={`
            ${showChatViewOnMobile ? 'hidden lg:flex' : 'flex'}
            w-full lg:w-[var(--chat-list-width)] shrink-0 flex-col overflow-hidden
          `}
          style={{ '--chat-list-width': `${chatListWidth}px` }}
        >
          <ChatList
            chats={filteredChats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Resizer Handle */}
        <div 
          className={`
            hidden lg:flex w-1 bg-gray-200 hover:bg-primary/50 active:bg-primary shrink-0 cursor-col-resize transition-colors
            ${isDragging ? 'bg-primary' : ''}
          `}
          onMouseDown={handleMouseDown}
        />

        {/* Panel 3: Chat View (Hidden on mobile if no chat is selected) */}
        <div className={`
          ${!showChatViewOnMobile && !selectedChatId ? 'hidden lg:flex' : 'flex'}
          w-full lg:w-auto lg:flex-1 flex-col overflow-hidden
        `}>
          {selectedChat ? (
            showInfoView ? (
              <ChatInfoView
                chat={selectedChat}
                onBack={() => setShowInfoView(false)}
              />
            ) : (
              <ChatView
                chat={selectedChat}
                messages={messages}
                onBack={handleBackToList}
                onOpenInfo={() => setShowInfoView(true)}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center bg-orange-50/20">
              <div className="flex flex-col items-center text-gray-300">
                <Mail size={64} className="mb-4 opacity-40 text-primary" strokeWidth={1} />
                <p className="font-medium text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
