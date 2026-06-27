import React from "react";
import Image from "next/image";

const ROLE_COLORS = {
  Influencer: "text-primary",
  Advertiser: "text-teal-500",
  Guest: "text-pink-500",
};

const DEFAULT_PARTICIPANTS = [
  { id: 1, name: "Jane Cooper", role: "Influencer", time: "2 hours ago" },
  { id: 2, name: "Jane Cooper", role: "Influencer", time: "2 hours ago" },
  { id: 3, name: "Jenny Wilson", role: "Advertiser", time: "2 hours ago" },
  { id: 4, name: "Floyd Miles", role: "Guest", time: "3 hours ago" },
  { id: 5, name: "Robert Fox", role: "Influencer", time: "5 hours ago" },
  { id: 6, name: "Albert Flores", role: "Guest", time: "1 day ago" },
];

export default function EventParticipants({
  participants = DEFAULT_PARTICIPANTS,
}) {
  return (
    <div className="bg-gray/5 rounded-3xl p-6 md:p-8 shadow-sm border border-gray/10 h-full">
      <h2 className="text-lg font-bold text-black mb-4">Participants</h2>
      <hr className="border-gray/20 mb-4" />

      {/* Scrollable Container */}
      <div className="max-h-80 overflow-y-auto no-scrollbar pr-1">
        <div className="flex flex-col gap-5">
          {participants.map(participant => (
            <div key={participant.id} className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray/20">
                {participant.avatar ? (
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray bg-gray/20">
                    {participant.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-black">
                    {participant.name}
                  </span>
                  <span
                    className={`text-xs ${ROLE_COLORS[participant.role] || "text-gray"}`}
                  >
                    ({participant.role})
                  </span>
                </div>
                <span className="text-xs text-gray">
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
