"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../Data/Data";

export default function Sidebar({ role = "advertiser", collapsed = false }) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.advertiser ?? [];

  return (
    <aside
      className={`
        flex flex-col h-screen bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-[72px]" : "w-[220px]"}
        sticky top-0 overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-5 py-5 shrink-0 ${collapsed ? "justify-center px-3" : ""}`}
      >
        {/* Placeholder logo — swap with next/image + your actual logo */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-gray-900 text-lg tracking-tight leading-none">
            Reel<span className="text-primary">UP</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pb-6 mt-1">
        <ul className="space-y-0.5">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition-all duration-150
                    ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
