"use client";

import Image from "next/image";
import { Bookmark, QrCode, Share2, Pencil, Calendar } from "lucide-react";

export default function ContestDetailsPage() {
  const contest = {
    title: "Best Summer Fashion Reel",
    banner: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    hostBy: "A.R Rahman",
    participants: "45/100",
    funds: "$6000",
    prize: "PS5",
    endDate: "Feb 15, 2026",
    timeLeft: "32 Days",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Contests</h1>
        <p className="text-sm text-gray-500">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Contests</span>
          {" / "}
          <span className="text-black">Contests Details</span>
        </p>

        <div className="mt-3 text-lg font-semibold">{contest.title}</div>
      </div>

      <div className="flex justify-end gap-3 -mt-14">
        <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
          <Bookmark size={16} />
        </button>
        <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
          <QrCode size={16} />
        </button>
        <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
          <Share2 size={16} />
        </button>
        <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
          <Pencil size={16} />
        </button>
      </div>

      <div className="relative w-full h-[360px] lg:h-[400px] rounded-2xl overflow-hidden mt-2">
        <Image
          src={contest.banner}
          alt="banner"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:opacity-90">
          Announce Winner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5">
          <h2 className="lg:text-base border-b border-gray-200 pb-4 text-sm text-gray-500 mb-2">
            Contest Title:{" "}
            <span className="text-black font-semibold">{contest.title}</span>
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Based on the timeframe and title, you are likely referring to the
            Digital Marketing World Forum (DMWF) Global 2026, which is the most
            prominent international event with this branding...
            <br />
            <br />
            This is a definitive event for senior leaders driving the future of
            marketing technology. It brings together over 3,000 attendees and
            100+ exhibitors to discuss the latest trends in the industry.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 space-y-4">
          <h2 className="lg:text-base border-b border-gray-200 pb-4 font-semibold">
            Contest details
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Host By</span>
              <span className="font-medium">{contest.hostBy}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Participants</span>
              <span className="font-medium">{contest.participants}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Founds</span>
              <span className="font-medium">{contest.funds}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Prize</span>
              <span className="font-medium">{contest.prize}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">End Date</span>
              <span className="font-medium">{contest.endDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Time Left</span>
              <span className="font-medium">{contest.timeLeft}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5">
          <h2 className="lg:text-base border-b border-gray-200 pb-4 font-semibold mb-4">
            Participants
          </h2>

          <div className="space-y-4">
            {[
              { name: "Jane Cooper", role: "Influencer" },
              { name: "Jane Cooper", role: "Influencer" },
              { name: "Jenny Wilson", role: "Advertiser" },
              { name: "Floyd Miles", role: "Guest" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />

                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">({p.role})</p>
                  </div>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
