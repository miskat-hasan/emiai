"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Link2 } from "lucide-react";
import ProfileForm from "./components/ProfileForm";
import LogoutModal from "./components/LogoutModal";
import Changepassword from "./components/Changepassword";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { InstagramIconSVG, SnapchatIconSVG } from "@/components/common/Svg";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about-me");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Normalized sidebar array keys to match active tab routing safely
  const sidebarTabs = [
    { id: "about-me", label: "About Me" },
    { id: "change-password", label: "Change Password" },
  ];

  const socialPlatforms = [
    { id: "snapchat", name: "Snapchat", handle: "@charlicursui", count: "1.2k", icon: <SnapchatIconSVG /> },
    { id: "instagram", name: "Instagram", handle: "@charlicurs01", count: "89k", icon: <InstagramIconSVG /> },
    { id: "tiktok", name: "Tiktok", handle: "@charliyt", count: "56k", icon: <SiTiktok className="text-[20px]" /> },
    { id: "youtube", name: "Youtube", handle: "@Charli YT", count: "56k", icon: <FaYoutube className="text-red-600 text-[22px]" /> },
    { id: "facebook", name: "Facebook", handle: "@charlicursui", count: "1.2k", icon: <FaFacebook className="text-blue-600 text-[22px]" /> },
  ];

  const handleLogoutConfirm = () => {
    console.log("Terminating session client tokens...");
    setLogoutModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ── Top Header Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center text-center space-y-3 shrink-0 xl:w-[350px]">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden group border border-gray-100 shadow-xs">
            <Image
              src="https://i.pravatar.cc/300"
              alt="Mia Torres Profile"
              fill
              className="object-cover"
            />
            <button type="button" className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg shadow-sm hover:scale-105 transition-transform cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Mia Torres</h2>
            <p className="text-xs font-medium text-gray mt-0.5">Influencer</p>
          </div>
          <button type="button" className="flex items-center gap-2 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 shadow-xs transition-opacity cursor-pointer">
            <Eye size={14} />
            <span>Guest View</span>
          </button>
        </div>
        
        <div className="flex-1 w-full bg-gray-50/50 border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
          <div>
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

          {/* Social Icons Strip Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.id}
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(17,91,151,0.25) 100%)" }}
                className="h-[60px] rounded-2xl border border-[#E8E8E8] px-4 flex items-center justify-between transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ECECEC] flex items-center justify-center shrink-0">
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#161616] leading-none">{platform.name}</h4>
                    <p className="text-[12px] text-[#7D7D7D] mt-1 leading-none">{platform.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-medium text-[#F68A3C]">{platform.count}</span>
                  <button type="button" className="cursor-pointer">
                    <Link2 size={18} className="rotate-45 text-[#2E2E2E] stroke-[2]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <nav className="flex flex-col gap-1 lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-4">
          {sidebarTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-5 py-3.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all text-left mt-2 cursor-pointer"
          >
            Logout
          </button>
        </nav>

        {/* Right Canvas Layout Switching Area */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 min-h-[450px]">
          {activeTab === "about-me" && <ProfileForm />}
          {activeTab === "change-password" && <Changepassword />}
        </div>
      </div>

      <LogoutModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}