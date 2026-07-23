// components/dashboard/notifications/NotificationsPage.jsx
"use client";

import { Bell, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/redux/api/services/notificationsApi";

const formatTime = dateStr => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotificationsPage({ role }) {
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetNotificationsQuery(page);
  const [markRead, { isLoading: isMarking }] =
    useMarkNotificationsReadMutation();

  const notifications = response?.data?.data || [];
  const lastPage = response?.data?.last_page || 1;
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAllRead = async () => {
    try {
      await markRead({}).unwrap();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to mark notifications as read",
      );
    }
  };

  const markOneRead = async n => {
    if (n.read_at) return;
    try {
      await markRead({ notification_id: n.id }).unwrap();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to mark notification as read",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          <Link
            href={`/dashboard/${role}`}
            className="text-primary font-medium hover:underline"
          >
            Dashboard
          </Link>
          {" / "}
          Notifications
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">
              Notification
            </h2>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0 || isMarking}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline disabled:opacity-40 disabled:no-underline transition-all cursor-pointer"
          >
            Mark all as read
            <Check size={14} />
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map(n => {
              const isRead = Boolean(n.read_at);
              return (
                <div
                  key={n.id}
                  onClick={() => markOneRead(n)}
                  className={`
                    flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors
                    ${isRead ? "bg-transparent hover:bg-gray-50/40" : "bg-primary/[0.03] hover:bg-primary/[0.06]"}
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full shrink-0 flex items-center justify-center mt-0.5
                      ${isRead ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary"}
                    `}
                  >
                    <Bell size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold leading-tight mb-1 ${isRead ? "text-gray-500" : "text-gray-900"}`}
                    >
                      {n.data?.title || "Notification"}
                      {!isRead && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {n.data?.message}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500 shrink-0 mt-0.5 whitespace-nowrap">
                    {formatTime(n.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Bell size={28} className="text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              No notifications yet
            </p>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-gray-500">
              Page {page} of {lastPage}
            </span>
            <button
              onClick={() => setPage(p => Math.min(lastPage, p + 1))}
              disabled={page === lastPage || isFetching}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
