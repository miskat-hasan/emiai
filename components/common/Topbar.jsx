"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Topbar({ user, onToggleSidebar }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-3.5">
      {/* Left — greeting + hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:block min-w-0">
          <p className="text-xs text-gray-400 leading-none mb-0.5">
            Hello {user?.name?.split(" ")[0]}!
          </p>
          <h1 className="text-base font-semibold text-gray-900 truncate leading-tight">
            {greeting()}
          </h1>
        </div>
      </div>

      {/* Right — search, bell, profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search bar (desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52 focus-within:border-primary/40 focus-within:bg-white transition-all">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {/* unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
              <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Notifications
              </p>
              {[
                { msg: "New deal offer from Lina Armand", time: "2m ago" },
                { msg: "Your ad was published successfully", time: "1h ago" },
                { msg: "Contest deadline tomorrow", time: "3h ago" },
              ].map((n, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <p className="text-sm text-gray-700">{n.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden shrink-0">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.[0] ?? "U"}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user?.role ?? "Member"}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              {["Profile", "Settings", "Sign out"].map((label) => (
                <button
                  key={label}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}