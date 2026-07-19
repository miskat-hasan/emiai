import { apiSlice } from "@/redux/api/apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // ── Conversations ──
    getConversations: builder.query({
      query: () => "/api/conversations",
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(c => ({ type: "Conversation", id: c.id })),
              { type: "Conversation", id: "LIST" },
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),

    createGroupConversation: builder.mutation({
      // body: { name, participants: [ids], group: { description, type, avatar } }
      query: body => ({ url: "/api/conversations", method: "POST", body }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    startPrivateConversation: builder.mutation({
      // body: { receiver_id }
      query: body => ({
        url: "/api/conversations/private",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    deleteConversation: builder.mutation({
      query: conversationId => ({
        url: `/api/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    // ── Users / presence ──
    getAvailableUsers: builder.query({
      query: ({ q, page, per_page } = {}) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (page) params.set("page", page);
        if (per_page) params.set("per_page", per_page);
        const qs = params.toString();
        return `/api/available-users${qs ? `?${qs}` : ""}`;
      },
      providesTags: [{ type: "AvailableUsers", id: "LIST" }],
    }),

    getOnlineUsers: builder.query({
      query: () => "/api/online-users",
    }),

    getBlockedUsers: builder.query({
      query: ({ page, per_page, search, role } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set("page", page);
        if (per_page) params.set("per_page", per_page);
        if (search) params.set("search", search);
        if (role) params.set("role", role);
        const qs = params.toString();
        return `/api/users/blocked${qs ? `?${qs}` : ""}`;
      },
      providesTags: [{ type: "BlockedUsers", id: "LIST" }],
    }),

    toggleBlockUser: builder.mutation({
      query: userId => ({
        url: `/api/users/${userId}/block-toggle`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Conversation", id: "LIST" },
        { type: "BlockedUsers", id: "LIST" },
      ],
    }),

    // ── Messages ──
    getMessages: builder.query({
      query: ({ conversationId, q, page, per_page }) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (page) params.set("page", page);
        if (per_page) params.set("per_page", per_page);
        const qs = params.toString();
        return `/api/messages/${conversationId}${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    sendMessage: builder.mutation({
      // body must be FormData: conversation_id, receiver_id?, message,
      // message_type, reply_to_message_id?, attachments[N][path]
      query: formData => ({
        url: "/api/messages",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, formData) => [
        { type: "Messages", id: formData.get("conversation_id") },
        { type: "Conversation", id: "LIST" },
      ],
    }),

    editMessage: builder.mutation({
      query: ({ messageId, message }) => ({
        url: `/api/messages/${messageId}`,
        method: "PUT",
        body: { message },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    deleteMessagesForMe: builder.mutation({
      query: ({ message_ids, conversationId }) => ({
        url: "/api/messages/delete-for-me",
        method: "DELETE",
        body: { message_ids },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    deleteMessageForEveryone: builder.mutation({
      query: ({ message_id, conversationId }) => ({
        url: "/api/messages/delete-for-everyone",
        method: "DELETE",
        body: { message_id },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    markConversationSeen: builder.mutation({
      query: conversationId => `/api/messages/seen/${conversationId}`,
      invalidatesTags: (result, error, conversationId) => [
        { type: "Conversation", id: "LIST" },
        { type: "Messages", id: conversationId },
      ],
    }),

    markMessagesSeen: builder.mutation({
      query: body => ({
        url: "/api/messages/mark-seen",
        method: "POST",
        body, // { message_ids, conversation_id }
      }),
      invalidatesTags: (result, error, body) => [
        { type: "Messages", id: body.conversation_id },
      ],
    }),

    forwardMessage: builder.mutation({
      query: ({ messageId, conversation_ids }) => ({
        url: `/api/messages/${messageId}/forward`,
        method: "POST",
        body: { conversation_ids },
      }),
    }),

    togglePinMessage: builder.mutation({
      query: ({ messageId, conversationId }) => ({
        url: `/api/messages/${messageId}/toggle-pin`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        { type: "PinnedMessages", id: conversationId },
      ],
    }),

    getPinnedMessages: builder.query({
      query: conversationId => `/api/messages/${conversationId}/pined-messages`,
      providesTags: (result, error, conversationId) => [
        { type: "PinnedMessages", id: conversationId },
      ],
    }),

    toggleReaction: builder.mutation({
      query: ({ messageId, reaction, conversationId }) => ({
        url: `/api/messages/${messageId}/reaction`,
        method: "POST",
        body: { reaction },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    getMessageReactions: builder.query({
      query: messageId => `/api/messages/${messageId}/reaction`,
    }),

    // ── Groups ──
    getGroupMembers: builder.query({
      query: groupId => `/api/group/${groupId}/members`,
      providesTags: (result, error, groupId) => [
        { type: "GroupMembers", id: groupId },
      ],
    }),

    addGroupMembers: builder.mutation({
      query: ({ groupId, member_ids }) => ({
        url: `/api/group/${groupId}/members/add`,
        method: "POST",
        body: { member_ids },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "GroupMembers", id: groupId },
        { type: "Conversation", id: "LIST" },
      ],
    }),

    removeGroupMembers: builder.mutation({
      query: ({ groupId, member_ids }) => ({
        url: `/api/group/${groupId}/members/remove`,
        method: "POST",
        body: { member_ids },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "GroupMembers", id: groupId },
        { type: "Conversation", id: "LIST" },
      ],
    }),

    addGroupAdmins: builder.mutation({
      query: ({ groupId, member_ids }) => ({
        url: `/api/group/${groupId}/admins/add`,
        method: "POST",
        body: { member_ids },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "GroupMembers", id: groupId },
      ],
    }),

    removeGroupAdmins: builder.mutation({
      query: ({ groupId, member_ids }) => ({
        url: `/api/group/${groupId}/admins/remove`,
        method: "POST",
        body: { member_ids },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "GroupMembers", id: groupId },
      ],
    }),

    leaveGroup: builder.mutation({
      query: groupId => ({
        url: `/api/group/${groupId}/leave`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    deleteGroup: builder.mutation({
      query: groupId => ({
        url: `/api/group/${groupId}/delete-group`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    regenerateInvite: builder.mutation({
      query: groupId => ({
        url: `/api/group/${groupId}/regenerate-invite`,
        method: "POST",
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Conversation", id: groupId },
      ],
    }),

    acceptGroupInvite: builder.mutation({
      query: token => `/api/accept-invite/${token}`,
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    updateGroupInfo: builder.mutation({
      // formData: name, group[avatar], group[description], group[type],
      // group[allow_members_to_send_messages], etc.
      query: ({ groupId, formData }) => ({
        url: `/api/group/${groupId}/update`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Conversation", id: "LIST" },
        { type: "Conversation", id: groupId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateGroupConversationMutation,
  useStartPrivateConversationMutation,
  useDeleteConversationMutation,
  useGetAvailableUsersQuery,
  useGetOnlineUsersQuery,
  useGetBlockedUsersQuery,
  useToggleBlockUserMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessagesForMeMutation,
  useDeleteMessageForEveryoneMutation,
  useMarkConversationSeenMutation,
  useMarkMessagesSeenMutation,
  useForwardMessageMutation,
  useTogglePinMessageMutation,
  useGetPinnedMessagesQuery,
  useToggleReactionMutation,
  useGetMessageReactionsQuery,
  useGetGroupMembersQuery,
  useAddGroupMembersMutation,
  useRemoveGroupMembersMutation,
  useAddGroupAdminsMutation,
  useRemoveGroupAdminsMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
  useRegenerateInviteMutation,
  useAcceptGroupInviteMutation,
  useUpdateGroupInfoMutation,
} = chatApi;
