export const MOCK_CHATS = [
  {
    id: "1",
    user: {
      name: "Olivia Mason",
      avatar: "https://i.pravatar.cc/150?u=olivia",
      isOnline: true,
      role: "Advertiser",
    },
    lastMessage: {
      text: "Hello I want to be make a ads with you. Can you tell me how much you'll for a kid class promotion...",
      timestamp: "10:24 AM",
    },
    unreadCount: 2,
    isStarred: false,
    folder: "inbox", // 'inbox', 'unread', 'group', 'saved'
    deliveryDate: "Oct 17, 2026",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556020685-e631933f4a01?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    user: {
      name: "Kathryn Murphy",
      avatar: "https://i.pravatar.cc/150?u=kathryn",
      isOnline: false,
      role: "Advertiser",
    },
    lastMessage: {
      text: "Hey there, I received an email from your company about a promotion. Can you give me more details...",
      timestamp: "09:40 AM",
    },
    unreadCount: 0,
    isStarred: false,
    folder: "inbox",
  },
  {
    id: "3",
    user: {
      name: "Esther Howard",
      avatar: "https://i.pravatar.cc/150?u=esther",
      isOnline: true,
      role: "Advertiser",
    },
    lastMessage: {
      text: "Hello, I received a damaged product and I'd like to arrange for a return or exchange.",
      timestamp: "04:59 PM",
    },
    unreadCount: 0,
    isStarred: false,
    folder: "inbox",
  },
  {
    id: "4",
    user: {
      name: "Group Chat",
      avatar: "HR", // Initials for group
      isOnline: false,
      role: "Group",
    },
    lastMessage: {
      sender: "Esther Howard",
      text: "Hi there, I'm interested in learning more about the company's privacy policy. Can you direct...",
      timestamp: "03:11 PM",
    },
    unreadCount: 0,
    isStarred: true,
    folder: "group",
    members: [
      { id: "1", name: "Jane Cooper", role: "Influencer", roleColor: "text-primary", avatar: "https://i.pravatar.cc/150?u=jane1" },
      { id: "2", name: "Jane Cooper", role: "Influencer", roleColor: "text-primary", avatar: "https://i.pravatar.cc/150?u=jane2" },
      { id: "3", name: "Jenny Wilson", role: "Advertiser", roleColor: "text-blue-500", avatar: "https://i.pravatar.cc/150?u=jenny1" },
      { id: "4", name: "Jenny Wilson", role: "Advertiser", roleColor: "text-blue-500", avatar: "https://i.pravatar.cc/150?u=jenny2" },
      { id: "5", name: "Floyd Miles", role: "Guest", roleColor: "text-pink-500", avatar: "https://i.pravatar.cc/150?u=floyd1" },
      { id: "6", name: "Floyd Miles", role: "Guest", roleColor: "text-pink-500", avatar: "https://i.pravatar.cc/150?u=floyd2" }
    ],
  },
  {
    id: "5",
    user: {
      name: "Bessie Cooper",
      avatar: "https://i.pravatar.cc/150?u=bessie",
      isOnline: false,
      role: "Advertiser",
    },
    lastMessage: {
      text: "Hello, I'm trying to submit a support ticket but I'm having trouble. Can you assist me with this?",
      timestamp: "09:25 AM",
    },
    unreadCount: 0,
    isStarred: false,
    folder: "inbox",
  },
  {
    id: "6",
    user: {
      name: "Ronald Richards",
      avatar: "https://i.pravatar.cc/150?u=ronald",
      isOnline: true,
      role: "Advertiser",
    },
    lastMessage: {
      text: "Hey, I've been experiencing some glitches with the mobile app. Can you help me troubleshoot this iss...",
      timestamp: "Yesterday",
    },
    unreadCount: 0,
    isStarred: false,
    folder: "inbox",
  },
];

export const MOCK_MESSAGES = {
  "1": [
    {
      id: "m1",
      senderId: "1", // ID of Olivia
      text: "Hello I want to be make a ads with you. Can you tell me how much you'll for a kid class promotional ads?",
      timestamp: "09:40 AM",
      isSelf: false,
      isStarred: true,
    },
    {
      id: "m2",
      senderId: "self",
      text: "Hi, I'd like to work with you can you give me more details about it? So I can tell you how much I'll charge",
      timestamp: "09:41 AM",
      isSelf: true,
      isStarred: false,
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "2",
      text: "Hey there, I received an email from your company about a promotion.",
      timestamp: "09:30 AM",
      isSelf: false,
      isStarred: false,
    },
    {
      id: "m2",
      senderId: "2",
      text: "Can you give me more details?",
      timestamp: "09:40 AM",
      isSelf: false,
      isStarred: false,
    },
  ],
  "4": [
    {
      id: "m1",
      senderId: "u1",
      senderAvatar: "https://i.pravatar.cc/150?u=olivia",
      text: "Hello I want to be make a ads with you. Can you tell me how much you'll for a kid class promotional ads?",
      timestamp: "09:40 AM",
      isSelf: false,
      isStarred: true,
    },
    {
      id: "m2",
      senderId: "self",
      text: "Hi, I'd like to work with you can you give me more details about it? So I can tell you how much I'll charge",
      timestamp: "09:41 AM",
      isSelf: true,
      isStarred: true,
    },
    {
      id: "m3",
      senderId: "u2",
      senderAvatar: "https://i.pravatar.cc/150?u=bald",
      text: "Hello I want to be make a ads with you. Can you tell me how much you'll for a kid class promotional ads?",
      timestamp: "09:40 AM",
      isSelf: false,
      isStarred: true,
    },
    {
      id: "m4",
      senderId: "u3",
      senderAvatar: "https://i.pravatar.cc/150?u=suit",
      text: "Hello I want to be make a ads with you. Can you tell me how much you'll for a kid class promotional ads?",
      timestamp: "09:40 AM",
      isSelf: false,
      isStarred: true,
    },
    {
      id: "m5",
      senderId: "self",
      text: "Hi, I'd like to work with you can you give me more details about it? So I can tell you how much I'll charge",
      timestamp: "09:41 AM",
      isSelf: true,
      isStarred: true,
    },
    {
      id: "m6",
      senderId: "u4",
      senderAvatar: "https://i.pravatar.cc/150?u=young",
      text: "Hello I want to be make a ads with you. Can you tell me how much you'll for a kid class promotional ads?",
      timestamp: "09:40 AM",
      isSelf: false,
      isStarred: true,
    },
  ],
};
