"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Headphones, Flag } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";

// ─── Mock — replace with real API/Redux fetch by `params.id` ─────────────────

const MOCK_DEAL = {
  id: 1,
  status: "Pending",
  person: "Lina Armand",
  avatar: null,
  date: "Feb 24, 2026",
  description:
    "Pellentesque suscipit fringilla libero eu ullamcorper. Cras risus eros, faucibus sit amet augue id, tempus pellentesque eros. In imperdiet tristique tincidunt. Integer lobortis lorem lorem,",
  netPayout: "SAR 5400",
  sponsor: {
    logo: null,
    name: "Sponsor by Robiul Tour",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealDetailPage({ params, role }) {
  const router = useRouter();

  // In real usage: fetch deal by params.id
  const deal = MOCK_DEAL;

  return (
    <div className="space-y-6   ">
      {/* ── Breadcrumb ── */}
      <div>
        <h1 className="text-2xl font-bold text-black">Deals</h1>
        <p className="text-sm text-gray mt-0.5">
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/${role}`)}
          >
            Dashboard
          </span>
          {" / "}
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/${role}/deals`)}
          >
            Deals
          </span>
          {" / "}
          <span>Details</span>
        </p>
      </div>

      {/* ── Deal detail card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-black">Statas</span>
          <div className="flex items-center gap-3">
            {/* Support icon */}
            <button
              className="flex flex-col items-center gap-0.5 text-gray hover:text-primary transition-colors"
              title="Contact Support"
            >
              <Headphones size={18} />
              <span className="text-[10px] leading-none">Support</span>
            </button>
            {/* Flag icon */}
            <button
              className="text-gray hover:text-red-500 transition-colors"
              title="Report"
            >
              <Flag size={18} />
            </button>
            <StatusBadge status={deal.status} />
          </div>
        </div>

        {/* Person row */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/60 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-primary to-secondary">
              {deal.avatar ? (
                <Image
                  src={deal.avatar}
                  alt={deal.person}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                  {deal.person?.[0] ?? "?"}
                </span>
              )}
            </div>
            <span className="text-base font-semibold text-black">
              {deal.person}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray">Date</p>
            <p className="text-sm font-semibold text-black">{deal.date}</p>
          </div>
        </div>

        {/* Description + payout */}
        <div className="flex items-start justify-between gap-8 px-6 py-5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black mb-2">
              Offer Description
            </p>
            <p className="text-sm text-gray leading-relaxed">
              {deal.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-black">Net Payout</p>
            <p className="text-sm font-bold text-black mt-0.5">
              {deal.netPayout}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 pb-6">
          <button
            onClick={() => console.log("reject", deal.id)}
            className="text-sm font-semibold text-primary hover:underline transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => console.log("accept", deal.id)}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            Accept
          </button>
        </div>
      </div>

      {/* ── Sponsor section ── */}
      <div
        className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100"
        style={{ background: "var(--stat-sublabel-bg, rgba(245,120,2,0.06))" }}
      >
        {/* Sponsor logo */}
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-gray-100 flex items-center justify-center">
          {deal.sponsor.logo ? (
            <Image
              src={deal.sponsor.logo}
              alt={deal.sponsor.name}
              width={56}
              height={56}
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
          )}
        </div>
        <p className="text-base font-semibold text-black">
          {deal.sponsor.name}
        </p>
      </div>
    </div>
  );
}
