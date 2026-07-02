import React from "react";
import Image from "next/image";

const ROLE_COLORS = {
  Influencer: "text-primary",
  Advertiser: "text-teal-500",
  Guest: "text-pink-500",
};

const DEFAULT_RANKINGS = [
  { id: 1, name: "Jane Cooper", role: "Influencer", score: 1000, avatar: "https://i.pravatar.cc/150?u=jane" },
  { id: 2, name: "Jane Cooper", role: "Influencer", score: 900, avatar: "https://i.pravatar.cc/150?u=janec" },
  { id: 3, name: "Jenny Wilson", role: "Advertiser", score: 800, avatar: "https://i.pravatar.cc/150?u=jenny" },
  { id: 4, name: "Floyd Miles", role: "Guest", score: 700, avatar: "https://i.pravatar.cc/150?u=floyd" },
  { id: 5, name: "David Johnson", role: "Guest", score: 550, avatar: "https://i.pravatar.cc/150?u=david" },
];

export default function AdTopRanking({ rankings = DEFAULT_RANKINGS, title = "Top 5" }) {
  return (
    <div className="bg-gradient-to-b from-white to-primary/4 rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-bold text-black mb-4">{title}</h2>
      <div className="flex flex-col gap-5">
        {rankings.map(user => (
          <div key={user.id} className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-200">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray bg-gray-200">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
              )}
            </div>

            {/* Name + Role */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-black">
                  {user.name}
                </span>
                <span className={`text-xs ${ROLE_COLORS[user.role] || "text-gray"}`}>
                  ({user.role})
                </span>
              </div>
            </div>

            {/* Score */}
            <span className="text-sm font-semibold text-black shrink-0">
              {user.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
