"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import Topbar from "@/components/common/Topbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const user = useSelector((state) => state.auth?.user) ?? {
    name: "Charli Levin",
    role: "agency",
    avatar: null,
  };

  const role = user?.role ?? " ";
  const themeClass = `theme-${role}`;

  const bgColors = {
    advertiser: "#DDE8F0",
    influencer: "#FFF6EE",
    agency: "#EDE0E6",
    manager: "#ECE1F2",
    business: "#ECE1F2",
    guest: "#EDDFE6",
  };

  const bgColorClass = bgColors[role] || "#FFF6EE";
  return (
    <div
      className={`${themeClass} flex h-screen overflow-hidden`}
      style={{
        background: `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 58%, ${bgColorClass} 100%)`,
      }}
    >
      {/* ── Mobile sidebar backdrop ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (desktop: always visible; mobile: slide-in drawer) ── */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar role={role} collapsed={sidebarCollapsed} />
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          user={user}
          onToggleSidebar={() => {
            // On mobile → toggle the drawer; on desktop → collapse
            if (window.innerWidth < 1024) {
              setMobileSidebarOpen((v) => !v);
            } else {
              setSidebarCollapsed((v) => !v);
            }
          }}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
