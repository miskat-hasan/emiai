"use client";
import Image from "next/image";
import PortfolioCard from "@/app/dashboard/influencer/portfolio/components/PortfolioCard";
import { Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

// Mock Data
const profileData = {
  name: "Mr. Ashraf",
  role: "Influencer",
  avatar: "/assets/images/user1.png", // fallback to a placeholder if needed
  stats: [
    { label: "Total Follower", value: "130k" },
    { label: "Completed Deal", value: "60" },
    { label: "Rating", value: "4.5" },
    { label: "Category", value: "Dancing, Education, Cultural" },
  ],
};

const portfolioItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1515263151253-6e58a214b7e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // use standard next image placeholder or mock
    likes: "13k",
    views: "3k",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my...",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1515263151253-6e58a214b7e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: "4.5k",
    views: "78k",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my...",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1515263151253-6e58a214b7e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: "23k",
    views: "23k",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my...",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1515263151253-6e58a214b7e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: "45k",
    views: "230k",
    title: "Mobile Ads Portfolio",
    details: "Hello this is about my p...",
  },
];

export default function PublicProfile() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="font-dm-sans space-y-10">
      {/* Heading & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Profile</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <Link
            href="/dashboard"
            className="text-primary font-medium hover:underline"
          >
            Dashboard
          </Link>{" "}
          /{" "}
          <Link
            href={`/dashboard/${user?.role}/inbox`}
            className="text-primary font-medium hover:underline"
          >
            Chat
          </Link>{" "}
          / {profileData.name}
        </p>
      </div>

      {/* Profile Details Top Section */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Avatar & Name */}
        <div className="flex flex-col items-center shrink-0 lg:w-1/3">
          <div className="w-[180px] h-[180px] rounded-2xl overflow-hidden mb-4 shadow-sm bg-gray-200">
            {/* image or letter shows here if no image */}
            {profileData.avatar && (
              <Image
                src={profileData.avatar}
                alt={profileData.name}
                width={140}
                height={140}
                className="w-full h-full object-cover"
              />
            )}
            {/* if no image then show letter */}
            {!profileData.avatar && (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                {profileData.name.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-[#203430]">
            {profileData.name}
          </h2>
          <p className="text-sm text-[#63716E] mt-1">{profileData.role}</p>
        </div>

        {/* Right: Stats & Actions */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl overflow-hidden mb-6">
            {profileData.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex justify-between items-center px-6 py-4 ${
                  idx !== profileData.stats.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <span className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </span>
                <span className="text-sm font-semibold text-[#203430]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#203430] hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm">
              <MessageSquare size={16} className="text-gray-500" />
              Chat
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/20">
              <Briefcase size={16} />
              Propose Deal
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div>
        <h3 className="text-lg font-bold text-[#203430] mb-6">Portfolio</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
