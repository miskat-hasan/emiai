"use client";

import Image from "next/image";
import { Link2, Pencil } from "lucide-react";

const socialPlatforms = [
  { id: "snapchat", name: "Snapchat", handle: "@charlicursui", count: "1.2k", icon: "https://cdn-icons-png.flaticon.com/512/1968/1968777.png" },
  { id: "instagram", name: "Instagram", handle: "@charlicurs01", count: "89k", icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
  { id: "tiktok", name: "Tiktok", handle: "@charliyt", count: "56k", icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png" },
  { id: "youtube", name: "Youtube", handle: "@Charli YT", count: "56k", icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png" },
  { id: "facebook", name: "Facebook", handle: "@charlicursui", count: "1.2k", icon: "https://cdn-icons-png.flaticon.com/512/124/124010.png" },
];

export default function AdvertiserInfoCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col xl:flex-row gap-8 items-start w-full">
      
      {/* Left Column: Profile Card Frame Block */}
      <div className="flex flex-col items-center text-center space-y-3 shrink-0 w-full xl:w-[240px] pt-2">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden group border border-gray-100 shadow-xs bg-[#0A7B95]">
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop" 
            alt="Charli Levin Profile"
            fill
            className="object-cover"
          />
          {/* Edit Circular Floating Button */}
          <button 
            type="button" 
            className="absolute bottom-1 right-1 p-1.5 bg-[#FF5C26] text-white rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white"
          >
            <Pencil size={12} className="stroke-[3]" />
          </button>
        </div>
        
        <div>
          <h2 className="text-base font-bold text-[#202626]">Charli Levin</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Advertiser</p>
        </div>
      </div>

      {/* Right Column: Key Metric Matrix Rows & Social Link Chips Grid */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Campaign Metrics Section Block Rows */}
        <div className="w-full bg-[#F9F9F9] border border-gray-100 rounded-2xl divide-y divide-[#EAEAEA] overflow-hidden">
          <div className="flex justify-between items-center px-6 py-3.5 text-xs font-medium">
            <span className="text-gray-400">Campaigns</span>
            <strong className="text-[#202626] font-bold text-sm">12</strong>
          </div>
          <div className="flex justify-between items-center px-6 py-3.5 text-xs font-medium">
            <span className="text-gray-400">Collaborations</span>
            <strong className="text-[#202626] font-bold text-sm">98</strong>
          </div>
          <div className="flex justify-between items-center px-6 py-3.5 text-xs font-medium">
            <span className="text-gray-400">Total Spent</span>
            <strong className="text-[#202626] font-bold text-sm">$554k</strong>
          </div>
        </div>

        {/* Connected Handles Capsule Layout Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialPlatforms.map((platform) => (
            <div 
              key={platform.id}
              className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 relative rounded-full bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image 
                    src={platform.icon} 
                    alt={platform.name}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#202626] leading-tight truncate">
                    {platform.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                    {platform.handle}
                  </p>
                </div>
              </div>

              {/* Counts & Disconnect / Chain icon container layout element */}
              <div className="flex items-center gap-2 pl-2">
                <span className="text-[11px] font-bold text-[#2D9CDB]">
                  {platform.count}
                </span>
                <button 
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-0.5"
                  title="Disconnect account"
                >
                  <Link2 size={14} className="rotate-45 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}