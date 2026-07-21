"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV_ITEMS } from "../Data/Data";
import { usePathname } from "next/navigation";
import ContactSupportModal from "./ContactSupportModal";

export default function Sidebar({ role = "advertiser", collapsed = false }) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.advertiser ?? [];
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  return (
    <>
      <aside
        className={`
        flex flex-col h-screen border-r max-lg:bg-white border-primary/10 mask-clip-border
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-18" : "w-61.25"}
        sticky top-0 overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent
      `}
      >
        {/* Logo */}
        <div
          className={`
          flex items-center gap-2.5 px-5 py-5 shrink-0
          ${collapsed ? "justify-center px-3!" : ""}
        `}
        >
          <div className="relative size-12 shrink-0">
            <Image
              src="/images/R-logo.png"
              alt="ReelUP"
              fill
              sizes="(max-width: 768px) 100vw, 15vw"
              className="object-contain"
            />
          </div>

          {!collapsed && (
            <div className="relative h-7 w-25">
              <Image
                src="/images/ReelUP-logo.png"
                alt="ReelUP"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-contain object-left"
              />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 pb-6 mt-1">
          <ul className="space-y-0.5 lg:space-y-2">
            {navItems.map(item => {
              const isActive = !supportModalOpen && pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  {item?.label === "Contact Support" ? (
                    <button
                      type="button"
                      onClick={() => setSupportModalOpen(true)}
                      title={collapsed ? item.label : undefined}
                      className={`
                    group flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition-all duration-150 cursor-pointer
                    ${supportModalOpen
                          ? "bg-gradient-to-br from-primary to-secondary text-white shadow-sm shadow-primary/30"
                          : "text-gray-500 hover:bg-primary/10 hover:text-gray-800"
                        }
                    ${collapsed ? "justify-center" : ""}
                  `}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors ${supportModalOpen ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setSupportModalOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`
                    group flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition-all duration-150
                    ${isActive
                          ? "bg-gradient-to-br from-primary to-secondary text-white shadow-sm shadow-primary/30"
                          : "text-gray-500 hover:bg-primary/10 hover:text-gray-800"
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
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <ContactSupportModal
        open={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        collapsed={collapsed}
        role={role}
      />
      
    </>
  );
}
