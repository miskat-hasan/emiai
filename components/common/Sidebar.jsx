"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "../Data/Data";

export default function Sidebar({ role = "influencer", collapsed = false }) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.advertiser;

  return (
    <aside
      className={`
        flex flex-col h-screen px-4 py-5
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-[72px]" : "w-[245px]"}
        sticky top-0 overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
      `}
    >
      {/* Logo */}
      <div>
        <Image
          src="/logo.png"
          alt="Logo"
          width={136}
          height={36}
          className="w-[136px] h-auto"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-5">
        <ul className="space-y-0.5 md:space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group flex pt-2.5 pb-2.5 pr-2.5 pl-3.5 items-center gap-[10px] self-stretch rounded-xl transition-all duration-150 font-medium text-sm
                    ${isActive
                      ? "bg-linear-to-r from-primary to-secondary text-white shadow-sm shadow-primary/30"
                      : "text-gray hover:bg-gray-50 hover:text-gray-800"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}