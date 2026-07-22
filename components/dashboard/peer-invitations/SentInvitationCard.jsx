// components/dashboard/peer-invitations/SentInvitationCard.jsx
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

const badgeStyles = {
  pending: "bg-[#fff7c7] text-[#936800]",
  accepted: "bg-[#dcfce7] text-[#15803d]",
  rejected: "bg-[#ffe1e1] text-[#e00000]",
  requested: "bg-[#eef2ff] text-[#4f63f6]",
};

export default function SentInvitationCard({
  invitation,
  onApprovePayment,
  onRejectPayment,
  isActioning = false,
}) {
  const paymentPending = invitation.paymentStatus === "requested";

  return (
    <div className="rounded-[18px] border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-bold leading-tight text-[#252525] sm:text-base">
          {invitation.title}
        </h3>

        <span
          className={`rounded-xl px-4 py-2 text-xs font-medium ${badgeStyles[invitation.statusTone] || badgeStyles.pending}`}
        >
          {invitation.status}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs font-bold text-[#252525]">Date</p>
          <p className="text-xs font-medium text-[#7a8582]">
            {invitation.date}
          </p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs font-bold text-[#252525]">Location</p>
          <p className="text-xs font-medium text-[#7a8582]">
            {invitation.location}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-[#f6f6f6] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
            {invitation.to.avatar ? (
              <Image
                src={getImageUrl(invitation.to.avatar)}
                alt={invitation.to.name}
                className="h-full w-full object-cover"
                height={36}
                width={36}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                {getInitials(invitation.to.name)}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-[#7a8582]">To:</p>
            <h4 className="text-sm font-bold text-[#26312f]">
              {invitation.to.name}
            </h4>
          </div>
        </div>

        <p className="text-[13px] font-medium leading-[1.35] text-[#1f2927]">
          {invitation.message}
        </p>
      </div>

      {invitation.isPaymentRequested && (
        <div className="mb-4 flex h-10 items-center justify-between rounded-xl bg-[#f3f3f3] px-4">
          <span className="text-xs font-medium text-[#7a8582]">
            {paymentPending ? "Payment Requested" : "Payment Amount"}
          </span>
          <span className="text-xs font-bold text-[#25302e]">
            ${invitation.requestedAmount}
          </span>
        </div>
      )}

      {paymentPending && (
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={isActioning}
            onClick={() => onRejectPayment?.(invitation)}
            className="h-11 rounded-xl border border-secondary bg-white text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Reject Payment
          </button>

          <button
            type="button"
            disabled={isActioning}
            onClick={() => onApprovePayment?.(invitation)}
            className="h-11 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Approve Payment
          </button>
        </div>
      )}
    </div>
  );
}
