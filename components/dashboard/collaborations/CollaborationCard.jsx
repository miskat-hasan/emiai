// components/dashboard/collaborations/CollaborationCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/helper/getImageUrl";

const statusStyles = {
  invited: "bg-[#fff7c7] text-[#936800]",
  pending: "bg-[#fff7c7] text-[#936800]",
  accepted: "bg-[#e6f4ea] text-[#1e7a3b]",
  rejected: "bg-[#fde8e8] text-[#c0392b]",
};

const statusLabels = {
  invited: "Pending",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function CollaborationCard({
  item,
  variant, // "incoming" | "sent"
  onAccept,
  onReject,
  onRequestPayment,
  isActioning = false,
}) {
  const isIncoming = variant === "incoming";
  const isPending =
    item.statusTone === "invited" || item.statusTone === "pending";
  const isAccepted = item.statusTone === "accepted";

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
            <Link
              href={item.detailsUrl}
              className="transition-colors hover:text-primary"
            >
              <h3 className="text-[14px] font-bold leading-tight text-[#202626] hover:text-primary">
                {item.title}
              </h3>
            </Link>

            <p className="mt-1 text-[11px] font-medium text-[#6d7774]">
              {isIncoming ? "Invited by " : "Invited "}
              {item.host}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-medium ${
            statusStyles[item.statusTone] || statusStyles.pending
          }`}
        >
          {statusLabels[item.statusTone] || item.status}
        </span>
      </div>

      {(item.date || item.location) && (
        <div className="mb-4 flex items-center gap-3 text-[11px] font-medium text-[#6d7774]">
          {item.date && (
            <span>
              {new Date(item.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {item.date && item.location && (
            <span className="text-gray-300">•</span>
          )}
          {item.location && <span className="truncate">{item.location}</span>}
        </div>
      )}

      {isIncoming && isPending && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isActioning}
            onClick={() => onReject?.(item)}
            className="h-9 rounded-lg border border-secondary bg-white text-[11px] font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Reject
          </button>

          <button
            type="button"
            disabled={isActioning}
            onClick={() => onAccept?.(item)}
            className="h-9 rounded-lg bg-[#f2f2f2] text-[11px] font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Accept
          </button>
        </div>
      )}

      {isIncoming && !isAccepted && onRequestPayment && (
        <button
          type="button"
          onClick={() => onRequestPayment(item)}
          className="mt-3 h-10 w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-[11px] font-bold text-white transition-all duration-300 hover:opacity-90 cursor-pointer"
        >
          Request Payment
        </button>
      )}
    </div>
  );
}
