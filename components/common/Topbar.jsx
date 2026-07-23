// components/common/Topbar.jsx
"use client";

import { teardownEcho } from "@/lib/echo";
import { apiSlice } from "@/redux/api/apiSlice";
import { useLogoutUserMutation } from "@/redux/api/authApi";
import { useGetUnreadNotificationCountQuery } from "@/redux/api/services/notificationsApi";
import { removeUser } from "@/redux/slices/authSlice";
import { Bell, ChevronDown, LogOut, Menu, User, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Topbar({ onToggleSidebar }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const isShareAppPage =
    pathname?.includes("/share-app") || pathname?.includes("/share");

  const user = useSelector(state => state.auth?.user);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  // Poll every 30s so the badge stays roughly current without a websocket push.
  const { data: unreadResponse } = useGetUnreadNotificationCountQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );
  const unreadCount = unreadResponse?.data?.count || 0;

  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    logoutUser()
      .unwrap()
      .then(() => {
        dispatch(removeUser());
        dispatch(apiSlice.util.resetApiState());
        teardownEcho();
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "role=; path=/; max-age=0; SameSite=Lax";
        toast.success("Logged out successfully");
        router.refresh();
        router.push("/login");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: User,
      action: () => router.push(`/dashboard/${user?.role}/profile`),
    },
    { label: "Sign out", icon: LogOut, action: handleLogout, danger: true },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md border-b border-primary/10 px-5 py-3.5">
      {/* ── Left — hamburger + greeting ── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:block min-w-0">
          <p className="text-xs text-gray leading-none mb-0.5">
            Hello {user?.name?.split(" ")[0]}!
          </p>
          <h1 className="text-base font-semibold text-black truncate leading-tight">
            {greeting()}
          </h1>
        </div>
      </div>

      {/* ── Right — search, bell, profile ── */}
      <div className="flex items-center gap-2 shrink-0">
        {isShareAppPage && (
          <div
            onClick={() => router.push("?showCoins=true", { scroll: false })}
            className="flex items-center justify-center gap-1.5 px-3 py-2 mr-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 rounded-2xl bg-white bg-gradient-to-b from-white/50 from-[56.57%] to-primary/50 to-[206.38%] backdrop-blur-[5.7px]"
          >
            <Zap size={18} className="text-primary fill-primary" />
            <span className="text-base font-medium text-primary leading-none">
              0
            </span>
          </div>
        )}

        {/* Notification bell */}
        <Link href={`/dashboard/${user?.role}/notifications`}>
          <button
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </Link>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden shrink-0 flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-bold">
                  {user?.name?.[0] ?? "U"}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-black leading-tight">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-gray capitalize">
                {user?.role ?? "Member"}
              </p>
            </div>
            <ChevronDown size={14} className="text-gray hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold text-black truncate">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs text-gray truncate">
                  {user?.email ?? ""}
                </p>
              </div>

              {profileMenuItems.map(({ label, icon: Icon, action, danger }) => (
                <button
                  key={label}
                  onClick={() => {
                    setProfileOpen(false);
                    action();
                  }}
                  disabled={isLoggingOut && danger}
                  className={`
                    w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer
                    ${danger ? "text-red-500 hover:bg-red-50" : "text-black hover:bg-primary/5"}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <Icon size={15} className="shrink-0" />
                  {isLoggingOut && danger ? "Signing out..." : label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
