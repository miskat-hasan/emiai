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

  const reduxUser = useSelector(state => state.auth?.user);

  const { data, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !!reduxUser,
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      dispatch(setUser(data?.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(removeUser());
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      router.push("/login");
    }
  }, [isError, dispatch, router]);

  const user = reduxUser;
  const role = user?.role ?? "guest";

  const themeClass = `theme-${role}`;

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
    <div className={`${themeClass} dashboard-bg flex h-screen overflow-hidden`}>
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50
          lg:relative lg:inset-auto lg:z-10
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar role={role} collapsed={sidebarCollapsed} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
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
