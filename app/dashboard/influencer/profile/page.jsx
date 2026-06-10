"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import ProfileForm from "./components/ProfileForm";
import BusinessManagerView from "./components/BusinessManagerView";
import PortfolioView from "./components/PortfolioView";
import AgencyView from "./components/AgencyView";
import SocialMediaConnect from "./components/SocialMediaConnect";
import LogoutModal from "./components/LogoutModal";

// Dummy placeholder components for your other navigation paths
const SocialConnectView = () => (
  <div className="text-black font-medium text-sm">
    Social Media Connection Portal
  </div>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about-me");

  // Sidebar link schema matching your layout perfectly
  const sidebarTabs = [
    { id: "about-me", label: "About Me" },
    { id: "business_manager", label: "Business Manager" },
    { id: "agency", label: "Agency" },
    { id: "portfolio", label: "My Portfolio" },
    { id: "social-connect", label: "Social media connect" },
  ];

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    console.log("Terminating session client tokens...");
    setLogoutModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ── Top Header Card (Employment Info Component Block) ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center text-center space-y-3 shrink-0 xl:w-[350px]">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden group border border-gray-100 shadow-xs">
            <Image
              src="https://i.pravatar.cc/300"
              alt="Mia Torres Profile"
              fill
              className="object-cover"
            />
            <button className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg shadow-sm hover:scale-105 transition-transform">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Mia Torres</h2>
            <p className="text-xs font-medium text-gray mt-0.5">Influencer</p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 shadow-xs transition-opacity">
            <Eye size={14} />
            <span>Guest View</span>
          </button>
        </div>

        <div className="flex-1 w-full bg-gray-50/50 border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
          <div className="flex justify-between items-center bg-[#F7F7F7] border-b border-[#E5E6E6] px-5 py-3.5 text-sm">
            <span className="text-gray font-medium">Total Follower</span>
            <strong className="text-black font-semibold">130k</strong>
          </div>
          <div className="flex justify-between items-center bg-[#F7F7F7] border-b border-[#E5E6E6] px-5 py-3.5 text-sm">
            <span className="text-gray font-medium">Completed Deal</span>
            <strong className="text-black font-semibold">60</strong>
          </div>
          <div className="flex justify-between items-center bg-[#F7F7F7] border-b border-[#E5E6E6] px-5 py-3.5 text-sm">
            <span className="text-gray font-medium">Rating</span>
            <strong className="text-black font-semibold">4.5</strong>
          </div>
        </div>
      </div>

      {/* ── Navigation Side Grid Content Architecture ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side Sidebar Rail Links */}
        <nav className="flex flex-col gap-1 lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-4">
          {sidebarTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-5 py-3.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray hover:bg-gray-50 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Explicit Logout Trigger Separation Point */}
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold text-gray hover:bg-red-50 hover:text-red-600 transition-all text-left mt-2 cursor-pointer"
          >
            Logout
          </button>
        </nav>

        {/* Right Panel Main Canvas Window Workspace */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 min-h-[450px]">
          {activeTab === "about-me" && <ProfileForm />}
          {activeTab === "business_manager" && <BusinessManagerView />}
          {activeTab === "agency" && <AgencyView />}
          {activeTab === "portfolio" && <PortfolioView />}
          {activeTab === "social-connect" && <SocialMediaConnect />}
        </div>
      </div>

      {/* Global Application View Gate Modal Stack */}
      <LogoutModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
