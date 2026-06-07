"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/authApi";
import { setUser, removeUser } from "@/redux/slices/authSlice";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // Try to read user from Redux first (set during login)
  const reduxUser = useSelector(state => state.auth?.user);

  // Always call getMe to rehydrate after reload — skips if no token cookie
  const { data, isError, isLoading } = useGetMeQuery(undefined, {
    // Only fetch if Redux user is missing (i.e. after a reload)
    skip: !!reduxUser,
  });

  // When getMe succeeds, hydrate Redux
  useEffect(() => {
    if (data?.success && data?.data) {
      dispatch(setUser({ ...data.data, token: null })); // token stays in cookie
    }
  }, [data, dispatch]);

  // If getMe fails (401), token is invalid — log out
  useEffect(() => {
    if (isError) {
      dispatch(removeUser());
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      router.push("/login");
    }
  }, [isError, dispatch, router]);

  // Resolve the user from Redux (either from login or from getMe hydration)
  const user = reduxUser;
  const role = user?.role ?? "influencer";
  const themeClass = `theme-${role}`;

  // Show nothing while fetching user on reload (avoids the map crash)
  if (!user && isLoading) {
    return (
      <div
        className={`${themeClass} flex h-screen items-center justify-center bg-gray-50`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-[#63716E]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClass} flex h-screen bg-gray-50 overflow-hidden`}>
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar role={role} collapsed={sidebarCollapsed} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setMobileSidebarOpen(v => !v);
            } else {
              setSidebarCollapsed(v => !v);
            }
          }}
        />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
