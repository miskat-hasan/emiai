import { getImageUrl } from "@/helper/getImageUrl";

function initials(name = "") {
  return (
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function formatTimestamp(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { day: "numeric", month: "short" });
}

// Maps a /api/conversations item to the `chat` shape ChatItem/ChatList/
// ChatView/ChatInfoView already expect (from the mock data contract).
export function mapConversationToChat(conversation) {
  const isGroup = conversation.type === "group";

  const user = isGroup
    ? {
        role: "Group",
        name: conversation.name ?? "Group",
        avatar: conversation.group_setting?.avatar
          ? getImageUrl(conversation.group_setting.avatar)
          : initials(conversation.name),
        isOnline: false,
      }
    : {
        id: conversation.receiver?.id,
        role: "User",
        name: conversation.receiver?.name ?? "Unknown",
        avatar: conversation.receiver?.avatar
          ? getImageUrl(conversation.receiver.avatar)
          : initials(conversation.receiver?.name),
        isOnline: !!conversation.receiver?.is_online,
      };

  const members = isGroup
    ? conversation.participants?.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        roleColor:
          p.role === "super_admin" || p.role === "admin"
            ? "text-primary"
            : "text-gray-400",
        avatar: p.avatar ? getImageUrl(p.avatar) : initials(p.name),
      }))
    : undefined;

  return {
    id: conversation.id,
    type: conversation.type,
    user,
    members,
    isAdmin: conversation.is_admin,
    isBlocked: conversation.is_blocked,
    blocked: conversation.blocked,
    isMuted: conversation.is_muted,
    inviteLink: conversation.invite_link,
    groupSetting: conversation.group_setting,
    unreadCount: conversation.unread_count ?? 0,
    // No "starred/saved" concept in the API yet — defaults to false.
    isStarred: false,
    lastMessage: {
      sender:
        isGroup && conversation.last_message?.sender
          ? conversation.last_message.sender.name
          : undefined,
      text: conversation.last_message?.message ?? "No messages yet",
      timestamp: formatTimestamp(
        conversation.last_message?.created_at ?? conversation.updated_at,
      ),
    },
    updatedAt: conversation.updated_at,
  };
}

// Maps a /api/messages/:id item to the shape ChatView expects.
export function mapApiMessage(msg) {
  const senderName = msg.sender?.name ?? "";
  return {
    id: msg.id,
    text: msg.message,
    messageType: msg.message_type,
    attachments: (msg.attachments ?? []).map(a => ({
      id: a.id,
      type: a.type, // "image" | "video" | "audio" | "file"
      url: a.path, // already an absolute URL — do NOT run through getImageUrl
      name: a.name,
      size: a.size,
    })),
    timestamp: formatTimestamp(msg.created_at),
    isSelf: !!msg.is_mine,
    // No per-message "starred" field from the API yet — local-only, resets on refetch.
    isPinned: !!msg.is_pinned,
    senderId: msg.sender?.id,
    senderName,
    senderAvatar: msg.owner?.avatar ? getImageUrl(msg.owner.avatar) : undefined,
    // reactions: msg.reactions?.reactions ?? [],
    // reactions: msg.reactions || { reactions: {}, total: 0 },
    // reactionTotal: msg.reactions?.total ?? 0,
    reactions: msg.reactions ?? { reactions: [], total: 0 },
    isSystem: msg.message_type === "system",
    replyTo: msg.reply,
    // No explicit is_edited flag documented — inferred from timestamp drift.
    // Flag to backend if this ever needs to be exact (e.g. if updated_at
    // can change for reasons other than an edit).
    isEdited:
      msg.created_at && msg.updated_at && msg.created_at !== msg.updated_at,
    statuses: msg.statuses ?? [],
  };
}
