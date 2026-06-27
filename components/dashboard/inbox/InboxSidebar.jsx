"use client";

import React from "react";
import { Plus, Mail, Inbox as InboxIcon, Users, Star } from "lucide-react";

// Using React.memo to prevent unnecessary re-renders when other parts of the page update
const InboxSidebar = React.memo(({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: "inbox", label: "Inbox", icon: Mail, count: counts.inbox },
    { id: "unread", label: "Unread", icon: InboxIcon, count: counts.unread },
    { id: "group", label: "Group", icon: Users, count: counts.group },
    { id: "saved", label: "Save Message", icon: Star },
  ];

  return (
    <div className="w-full lg:w-[250px] shrink-0 flex flex-col gap-6">
      {/* Create Group Button */}
      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-3.5 rounded-xl font-medium shadow-[0_8px_20px_rgba(240,90,40,0.25)] hover:opacity-90 transition-opacity">
        <Plus size={20} />
        Create Group
      </button>

      {/* Navigation Tabs */}
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-transparent text-gray-900 font-semibold"
                  : "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-gray-500 hover:text-black"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? "text-primary" : "text-gray-400"} />
                <span className="text-sm">{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <div className={`
                  flex items-center justify-center min-w-[24px] h-[24px] px-1.5 rounded-full text-xs font-semibold
                  ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}
                `}>
                  {tab.count}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

InboxSidebar.displayName = "InboxSidebar";

export default InboxSidebar;
