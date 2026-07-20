// app/dashboard/influencer/components/PaymentRequestCard.jsx
"use client";

import Image from "next/image";
import { getImageUrl } from "@/helper/getImageUrl";

const statusStyles = {
  pending: "bg-[#fff7c7] text-[#936800]",
  processing: "bg-[#fff7c7] text-[#936800]",
  approved: "bg-[#e6f4ea] text-[#1e7a3b]",
  rejected: "bg-[#fde8e8] text-[#c0392b]",
};

export default function PaymentRequestCard({
  item,
  onAccept,
  onReject,
  isActioning = false,
}) {
  const isPending =
    item.paymentStatusTone === "pending" ||
    item.paymentStatusTone === "processing";

  return (
    <div className="rounded-[14px] border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
            <Image
              src={getImageUrl(item.avatar)}
              alt={item.host}
              className="h-full w-full object-cover"
              width={40}
              height={40}
            />
          </div>

          <div>
            <h3 className="text-[14px] font-bold leading-tight text-[#202626]">
              {item.title}
            </h3>
            <p className="mt-1 text-[11px] font-medium text-[#6d7774]">
              By {item.host}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-medium ${
            statusStyles[item.paymentStatusTone] || statusStyles.pending
          }`}
        >
          {item.paymentStatus}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-bold text-[#202626]">Requested</p>
        <p className="text-[11px] font-medium text-[#6d7774]">
          {item.currency}
          {item.amount}
        </p>
      </div>

      {isPending && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isActioning}
            onClick={() => onReject?.(item)}
            className="h-9 rounded-lg border border-secondary bg-white text-[11px] font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject
          </button>

          <button
            type="button"
            disabled={isActioning}
            onClick={() => onAccept?.(item)}
            className="h-9 rounded-lg bg-[#f2f2f2] text-[11px] font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
