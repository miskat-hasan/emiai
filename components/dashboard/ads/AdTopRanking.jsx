"use client";
import { getImageUrl } from "@/helper/getImageUrl";
import React, { useMemo } from "react";
import Image from "next/image";
import { useGetAdWinnersQuery } from "@/redux/api/services/adApi";

const ROLE_COLORS = {
  Influencer: "text-primary",
  Advertiser: "text-teal-500",
  Guest: "text-pink-500",
};

// const DEFAULT_RANKINGS = [
//   { id: 1, name: "Jane Cooper", role: "Influencer", score: 1000, avatar: "https://i.pravatar.cc/150?u=jane" },
//   { id: 2, name: "Jane Cooper", role: "Influencer", score: 900, avatar: "https://i.pravatar.cc/150?u=janec" },
//   { id: 3, name: "Jenny Wilson", role: "Advertiser", score: 800, avatar: "https://i.pravatar.cc/150?u=jenny" },
//   { id: 4, name: "Floyd Miles", role: "Guest", score: 700, avatar: "https://i.pravatar.cc/150?u=floyd" },
//   { id: 5, name: "David Johnson", role: "Guest", score: 550, avatar: "https://i.pravatar.cc/150?u=david" },
// ];

export default function AdTopRanking({ adId, rankings, title = "Top Performers" }) {
  const { data: response, isLoading } = useGetAdWinnersQuery(adId, {
    skip: !adId,
  });

  const winnersList = useMemo(() => {
    if (adId && response) {
      let apiData = [];
      if (Array.isArray(response)) {
        apiData = response.data;
      } 
      else if (response.data && Array.isArray(response.data)) {
        apiData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        apiData = response.data.data;
      }

      return apiData.map((winner, index) => ({
        id: winner.id || index,
        name: winner.user?.name || winner.name || "Unknown User",
        role: winner.user?.role || winner.role || "Guest",
        score: winner.score || winner.points || winner.prize_value || 0,
        avatar: winner.user?.avatar || winner.avatar || null,
      }));
    }
    return null;
  }, [response, adId]);

  const displayRankings = winnersList || rankings 

  if (adId && !isLoading && winnersList && winnersList.length === 0) {
    return (
      <div className="bg-gradient-to-b from-white to-primary/4 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-black mb-4">{title}</h2>
        <div className="text-center text-gray py-4">No winners declared yet.</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-primary/4 rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-bold text-black mb-4">{title}</h2>
      
      {isLoading ? (
        <div className="flex flex-col gap-5 animate-pulse">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="flex items-center gap-4">
               <div className="w-11 h-11 rounded-full bg-gray-200"></div>
               <div className="flex-1 space-y-2">
                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
               </div>
               <div className="w-8 h-4 bg-gray-200 rounded"></div>
             </div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {displayRankings.map(user => (
            <div key={user.id} className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-200">
                {user.avatar ? (
                  <Image
                    src={getImageUrl(user.avatar)}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray bg-gray-200 uppercase">
                    {user.name.split(" ").map(n => n[0]).join("").substring(0,2)}
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
      )}
    </div>
  );
}
