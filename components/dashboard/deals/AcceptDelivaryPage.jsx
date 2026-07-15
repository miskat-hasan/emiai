"use client";

import { Flag, Headphones, MessageSquare, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MOCK_DEAL = {
  id: 1,
  status: "pending",
  person: "Lina Armand",
  avatar: null, // Replace with actual avatar URL if available
  duration: "10 Days",
  date: "Feb 24, 2026",
  deliveryMessage:
    "Pellentesque suscipit fringilla libero eu ullamcorper. Cras risus eros, faucibus sit amet augue id, tempus pellentesque eros. In imperdiet tristique tincidunt. Integer lobortis lorem lorem,",
  netPayout: "SAR 5400",
  deliveryImage:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop", // placeholder image mimicking the screenshot
  sponsor: {
    logo: null,
    name: "Sponsor by Robiul Tour",
  },
};

export default function AcceptDelivaryPage({ role = "influencer" }) {
  const router = useRouter();
  const deal = MOCK_DEAL;

  return (
    <div className="space-y-6">
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
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden relative shadow-sm">
        {/* 95% Smart Match Badge */}
        <div className="absolute top-0 left-6">
          <div className="bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-bold px-4 py-1.5 rounded-b-xl shadow-sm">
            95% Smart Match
          </div>
        </div>

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 pt-12 border-b border-gray-100">
          <span className="text-base font-bold text-black">Statas</span>
          <div className="flex items-center gap-3">
            {/* Info icon */}
            <button
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
              title="Info"
            >
              <Info size={15} />
            </button>

            {/* Support icon */}
            <button
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors relative"
              title="Contact Support"
            >
              <Headphones size={15} />
              <span className="absolute -bottom-3 text-[9px] font-semibold text-gray-400">Support</span>
            </button>

            {/* Chat icon */}
            <button
              className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
              title="Chat"
            >
              <MessageSquare size={15} />
            </button>
            
            <div className="px-5 py-2 rounded-xl bg-blue-100 text-blue-500 text-xs font-bold ml-2">
              In Pending
            </div>
          </div>
        </div>

        {/* Person row */}
        <div className="flex items-center justify-between px-6 py-5 bg-gray-50/40 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-primary to-secondary shadow-sm">
              {deal.avatar ? (
                <Image
                  src={deal.avatar}
                  alt={deal.person}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                  {deal.person.at(0)}
                </span>
              )}
            </div>
            <span className="text-[17px] font-bold text-black">
              {deal.person}
            </span>
          </div>
          <div className="flex items-center gap-16">
            <div className="text-right">
              <p className="text-xs text-black font-bold mb-1">Deal Duration</p>
              <p className="text-[13px] text-gray">
                {deal.duration}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-black font-bold mb-1">Date</p>
              <p className="text-[13px] text-gray">
                {deal.date}
              </p>
            </div>
          </div>
        </div>

        {/* Description + payout */}
        <div className="flex items-start justify-between gap-8 px-6 py-6">
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-black mb-2.5">
              Delivery Message
            </p>
            <p className="text-[13px] text-gray leading-relaxed max-w-4xl">
              {deal.deliveryMessage}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[15px] font-bold text-black mb-2.5">Net Payout</p>
            <p className="text-[13px] text-gray">
              {deal.netPayout}
            </p>
          </div>
        </div>

        {/* Delivery Image */}
        <div className="px-6 pb-8">
          <div className="w-full h-[240px] md:h-[340px] rounded-[20px] overflow-hidden relative shadow-sm border border-gray-100">
            <Image
              src={deal.deliveryImage}
              alt="Delivery content"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between py-1 px-2">
        <button
          onClick={() => console.log("cancel")}
          className="text-[15px] font-medium text-red-500 hover:opacity-80 transition-opacity cursor-pointer"
        >
          Cancel Delivery
        </button>
        <button
          onClick={() => console.log("accept")}
          className="px-8 py-3 rounded-[14px] bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-bold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
        >
          Accept Delivery
        </button>
      </div>

      {/* ── Sponsor section ── */}
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-full border border-gray-100 bg-white shadow-sm mt-8 relative overflow-hidden"
      >
        {/* Subtle right-side gradient overlay mimicking the screenshot */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        
        {/* Sponsor logo */}
        <div className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0 bg-white border border-gray-100 flex items-center justify-center relative z-10 shadow-sm">
          {deal.sponsor.logo ? (
            <Image
              src={deal.sponsor.logo}
              alt={deal.sponsor.name}
              width={52}
              height={52}
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-xl">🚌</span>
            </div>
          )}
        </div>
        <p className="text-[17px] font-bold text-black relative z-10">
          {deal.sponsor.name}
        </p>
      </div>
    </div>
  );
}
