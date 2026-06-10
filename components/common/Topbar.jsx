"use client";

import {
  Bell,
  Search,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutUserMutation } from "@/redux/api/authApi";
import { removeUser } from "@/redux/slices/authSlice";

export default function Topbar({ onToggleSidebar }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth?.user);

  console.log("topbar user", user);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  useEffect(() => {
    const handler = e => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
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

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // fail silently
    } finally {
      dispatch(removeUser());
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "role=; path=/; max-age=0; SameSite=Lax";
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: User,
      action: () => router.push(`/dashboard/${user?.role}/profile`),
    },
    // {
    //   label: "Settings",
    //   icon: Settings,
    //   action: () => router.push("/dashboard/settings"),
    // },
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
        {/* Search */}
        {/* <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52 focus-within:border-primary/40 focus-within:bg-white transition-all">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-black placeholder-gray-400 outline-none w-full"
          />
        </div> */}

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen(v => !v);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
              <p className="px-4 pb-2 text-xs font-semibold text-gray uppercase tracking-wider">
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
                  <p className="text-sm text-black">{n.msg}</p>
                  <p className="text-xs text-gray mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen(v => !v);
              setNotifOpen(false);
            }}
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
              {/* User info header */}
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
                    ${
                      danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-black hover:bg-primary/5"
                    }
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
