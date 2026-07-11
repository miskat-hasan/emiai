"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import { useState } from "react";
import Image from "next/image";

// Mock data mirroring your design layout specs
const initialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@hgssfis01",
    followers: "45k",
    icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
    connected: true,
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@wspg zu",
    followers: "45k",
    icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
    connected: true,
  },
  {
    id: "youtube",
    name: "You tube",
    handle: "@Chah YT",
    followers: "45k",
    icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    connected: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "@xfghdhfdh",
    followers: "45k",
    icon: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
    connected: true,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    handle: "",
    followers: "",
    icon: "https://cdn-icons-png.flaticon.com/512/1968/1968777.png",
    connected: false,
  },
];

export default function SocialMediaConnect() {
  const [platforms, setPlatforms] = useState(initialPlatforms);

  const toggleConnection = (id) => {
    setPlatforms((prev) =>
      prev.map((platform) => {
        if (platform.id === id) {
          const isConnecting = !platform.connected;
          return {
            ...platform,
            connected: isConnecting,
            // Mocking a default handle/count assignment when clicking "connect"
            handle: isConnecting ? "@new_user" : "",
            followers: isConnecting ? "0" : "",
          };
        }
        return platform;
      })
    );
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 md:p-8 space-y-6">
      {/* Component Title Header */}
      <div>
        <h3 className="text-lg font-bold text-[#202626]">Social Media</h3>
        <hr className="mt-4 border-gray-100/80" />
      </div>

      {/* Platforms Column Structure */}
      <div className="space-y-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between min-h-[56px] transition-all"
          >
            {/* Identity Column Left */}
            <div className="flex items-center gap-4 min-w-[180px]">
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={getImageUrl(platform.icon)}
                  alt={platform.name}
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#202626]">
                  {platform.name}
                </h4>
                {platform.connected && platform.handle && (
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {platform.handle}
                  </p>
                )}
              </div>
            </div>

            {/* Middle Analytics Column */}
            <div className="flex-1 text-left pl-6 md:pl-12">
              {platform.connected && platform.followers && (
                <span className="text-sm font-semibold text-[#202626]">
                  {platform.followers}
                </span>
              )}
            </div>

            {/* Action State Buttons Right */}
            <div>
              <button
                type="button"
                onClick={() => toggleConnection(platform.id)}
                className={`text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                  platform.connected
                    ? "bg-gradient-to-r from-[#FF5C26] to-[#FF5C26] text-white hover:opacity-90"
                    : "bg-gradient-to-r from-[#FF7A30] to-[#FF4500] text-white hover:brightness-105"
                }`}
              >
                {platform.connected ? "Disconnect" : "connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}