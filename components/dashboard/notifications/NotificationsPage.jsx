"use client";

import { Bell, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "You have new notification",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud",
    time: "03:11 PM",
    read: false,
  },
  {
    id: 2,
    title: "New message from John",
    body: "Curabitur pretium tincidunt lacus, ut ultrices neque. Proin ullamcorper pharetra justo, a venenatis orci malesuada eget.",
    time: "04:22 PM",
    read: false,
  },
  {
    id: 3,
    title: "System update available",
    body: "Fusce at massa vel odio volutpat malesuada non sed libero. Nulla facilisi. Sed vestibulum felis vel metus rhoncus, at sagittis ante suscipit.",
    time: "05:45 PM",
    read: false,
  },
  {
    id: 4,
    title: "Meeting reminder",
    body: "Praesent tincidunt, magna eget dapibus fringilla, sapien nisi dignissim nunc, ac elementum arcu eros a ante.",
    time: "06:30 PM",
    read: false,
  },
  {
    id: 5,
    title: "Friend request received",
    body: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer non tincidunt mauris.",
    time: "07:15 PM",
    read: false,
  },
  {
    id: 6,
    title: "Password change confirmation",
    body: "Mauris sed felis vitae libero dapibus gravida. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    time: "08:50 PM",
    read: false,
  },
  {
    id: 7,
    title: "New event added to calendar",
    body: "Nam convallis, dolor ac vehicula venenatis, libero massa aliquet mauris, a tempor leo diam sed nulla.",
    time: "09:05 PM",
    read: false,
  },
  {
    id: 8,
    title: "Weekly report available",
    body: "In non quam sit amet nulla fermentum laoreet. Sed ac justo non libero semper viverra.",
    time: "10:00 PM",
    read: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage({ role }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline disabled:opacity-40 disabled:no-underline transition-all cursor-pointer"
          >
            Make as view
            <Check size={14} />
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markOneRead(n.id)}
              className={`
                flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors
                ${n.read ? "bg-transparent hover:bg-gray-50/40" : "bg-primary/[0.03] hover:bg-primary/[0.06]"}
              `}
            >
              {/* Bell icon */}
              <div
                className={`
                w-10 h-10 rounded-full shrink-0 flex items-center justify-center mt-0.5
                ${n.read ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary"}
              `}
              >
                <Bell size={16} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold leading-tight mb-1 ${n.read ? "text-gray-500" : "text-gray-900"}`}
                >
                  {n.title}
                  {!n.read && (
                    <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />
                  )}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {n.body}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs text-gray-500 shrink-0 mt-0.5 whitespace-nowrap">
                {n.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
