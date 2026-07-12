"use client";

import MultiSelect from "@/components/ui/MultiSelect";
import {
  useGetEventByIdQuery,
  useSendEventInvitationMutation,
} from "@/redux/api/services/eventApi";
import {
  useGetAllUsersQuery,
  useLazySearchUsersQuery,
} from "@/redux/api/services/userApi";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SendInvitationFlow({ eventId, open, onClose }) {
  const [invitedUserId, setInvitedUserId] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [sendInvitation, { isLoading: isSending }] =
    useSendEventInvitationMutation();
  const { data: eventResponse, isLoading: isEventLoading } =
    useGetEventByIdQuery(eventId, { skip: !eventId || !open });

  const { data: allUsersResponse, isLoading: isAllUsersLoading } =
    useGetAllUsersQuery(undefined, { skip: !open });
  const [searchUsers, { data: usersResponse, isLoading: isSearchLoading }] =
    useLazySearchUsersQuery();

  // Handle user search (debounced)
  useEffect(() => {
    if (open && searchQuery) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, open, searchUsers]);

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setInvitedUserId([]);
      setTicketId("");
      setMessage("");
      setSearchQuery("");
    }
  }, [open]);

  if (!open) return null;

  const getArrayData = (queryData) => {
    if (Array.isArray(queryData)) return queryData;
    if (Array.isArray(queryData?.data)) return queryData.data;
    if (Array.isArray(queryData?.data?.data)) return queryData.data.data;
    return [];
  };

  const allUsers = getArrayData(allUsersResponse);
  const searchResults = getArrayData(usersResponse);

  const users = searchQuery ? searchResults : allUsers;
  const isUsersLoading = searchQuery ? isSearchLoading : isAllUsersLoading;

  const tickets = eventResponse?.data?.tickets || [];
  const ticketOptions = tickets.map((t) => ({
    id: t.id,
    name: t.ticket_type || "Standard",
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Event is missing.");
      return;
    }
    if (invitedUserId.length === 0) {
      toast.error("Please select at least one user to invite.");
      return;
    }
    if (!ticketId) {
      toast.error("Please select a ticket.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a message.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("event_id", eventId);

      invitedUserId.forEach((userId) => {
        formData.append("invited_user_ids[]", userId);
      });

      formData.append("ticket_id", ticketId);
      formData.append("message", message);

      await sendInvitation(formData).unwrap();
      toast.success("Invitations sent successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send invitation(s).");
    }
  };

  const handleUserChange = (selected) => {
    setInvitedUserId(selected);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray hover:text-black"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-black mb-6">Send Invitation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <MultiSelect
              id="invitedUserId"
              label="Select User(s)"
              placeholder="Search and select users"
              options={users}
              value={invitedUserId}
              onChange={handleUserChange}
              onSearchChange={setSearchQuery}
              isLoading={isUsersLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black mb-2 block">
              Ticket
            </label>
            <select
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="w-full bg-gray/5 rounded-xl px-4 py-3 text-sm text-black outline-none border border-transparent focus:border-primary/20"
              disabled={isEventLoading}
            >
              <option value="">Select a ticket</option>
              {ticketOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-black mb-2 block">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your invitation message here..."
              rows={4}
              className="w-full bg-gray/5 rounded-xl px-4 py-3 text-sm text-black outline-none border border-transparent focus:border-primary/20 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSending || isEventLoading}
            className="w-full bg-gradient-to-b from-primary to-secondary hover:opacity-90 text-white py-3.5 rounded-2xl font-medium text-[16px] transition-all duration-200 disabled:opacity-50 mt-4"
          >
            {isSending ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
