import { getImageUrl } from "@/helper/getImageUrl";
import React from "react";
import Image from "next/image";

const ROLE_COLORS = {
  influencer: "text-primary",
  advertiser: "text-teal-500",
  guest: "text-pink-500",
  agency: "text-purple-500",
};


export default function EventParticipants({
  participants
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
              <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-primary flex items-center justify-center text-white font-bold text-lg uppercase">
                {participant.avatar ? (
                  <Image
                    src={getImageUrl(participant.avatar)}
                    alt={participant.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{participant.name ? participant.name.charAt(0) : "?"}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-black">
                    {participant.name}
                  </span>
                  <span
                    className={`text-xs capitalize ${participant.role ? ROLE_COLORS[participant.role.toLowerCase()] || "text-gray" : "text-gray"}`}
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
