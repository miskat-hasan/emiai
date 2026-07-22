// components/dashboard/peer-invitations/PaymentRequestCard.jsx
"use client";
import { getImageUrl } from "@/helper/getImageUrl";
import Image from "next/image";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = date =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function PaymentRequestCard({
  item,
  onApprove,
  onReject,
  isActioning = false,
}) {
  return (
    <div className="rounded-[18px] border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-bold leading-tight text-[#252525] sm:text-base">
          {item.title}
        </h3>

        <span className="rounded-xl bg-[#eef2ff] px-4 py-2 text-xs font-medium text-[#4f63f6]">
          Payment Requested
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs font-bold text-[#252525]">Date</p>
          <p className="text-xs font-medium text-[#7a8582]">{item.date}</p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs font-bold text-[#252525]">Location</p>
          <p className="text-xs font-medium text-[#7a8582]">{item.location}</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-[#f6f6f6] p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
            {item.from.avatar ? (
              <Image
                src={getImageUrl(item.from.avatar)}
                alt={item.from.name}
                className="h-full w-full object-cover"
                height={36}
                width={36}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {getInitials(item.from.name)}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-[#7a8582]">Requested by:</p>
            <h4 className="text-sm font-bold text-[#26312f]">
              {item.from.name}
            </h4>
          </div>
        </div>
      </div>

      <div className="mb-4 flex h-10 items-center justify-between rounded-xl bg-[#f3f3f3] px-4">
        <span className="text-xs font-medium text-[#7a8582]">
          Requested Amount
        </span>
        <span className="text-xs font-bold text-[#25302e]">
          ${item.requestedAmount}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={isActioning}
          onClick={() => onReject?.(item)}
          className="h-10 rounded-xl border border-secondary bg-white text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Reject
        </button>

        <button
          type="button"
          disabled={isActioning}
          onClick={() => onApprove?.(item)}
          className="h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

export { formatDate };
