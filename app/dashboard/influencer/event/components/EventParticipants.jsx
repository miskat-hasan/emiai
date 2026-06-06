import React from "react";
import Image from "next/image";

const mockParticipants = [
  {
    id: 1,
    name: "Jane Cooper",
    role: "(Influencer)",
    time: "2 hours ago",
    avatar: "/assets/demo.png",
  },
  {
    id: 2,
    name: "Jane Cooper",
    role: "(Influencer)",
    time: "2 hours ago",
    avatar: "/assets/demo.png",
  },
  {
    id: 3,
    name: "Jenny Wilson",
    role: "(Advertiser)",
    time: "2 hours ago",
    avatar: "/assets/demo.png",
  },
  {
    id: 4,
    name: "Floyd Miles",
    role: "(Guest)",
    time: "3 hours ago",
    avatar: "/assets/demo.png",
  },
  {
    id: 5,
    name: "Robert Fox",
    role: "(Influencer)",
    time: "5 hours ago",
    avatar: "/assets/demo.png",
  },
  {
    id: 6,
    name: "Albert Flores",
    role: "(Guest)",
    time: "1 day ago",
    avatar: "/assets/demo.png",
  },
];

export default function EventParticipants() {
  return (
    <div className="bg-[#f9fafb] rounded-[2rem] p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Participants</h2>

      <hr className="my-4 border-gray-200" />

      {/* Scrollable Container */}
      <div className="max-h-[320px] overflow-y-auto no-scrollbar pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex flex-col gap-5">
          {mockParticipants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image
                  src={participant.avatar}
                  alt={participant.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[15px] font-medium text-gray-900">
                    {participant.name}
                  </span>
                  <span
                    className={`text-[13px] ${
                      participant.role.includes("Influencer")
                        ? "text-orange-500"
                        : participant.role.includes("Advertiser")
                          ? "text-teal-500"
                          : "text-pink-500"
                    }`}
                  >
                    {participant.role}
                  </span>
                </div>
                <span className="text-[13px] text-gray-500">
                  {participant.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
