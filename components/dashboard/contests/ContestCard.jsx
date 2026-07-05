// components/dashboard/contests/ContestCard.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Info, CalendarDays } from "lucide-react";
import { useJoinContestMutation } from "@/redux/api/services/contestApi";
import JoinContestModal from "./JoinContestModal";

function formatEntryFee(entryFee) {
  if (entryFee === undefined || entryFee === null) return "—";
  const amount = Number(entryFee);
  if (amount === 0) return "Free";
  return `$${amount.toLocaleString()}`;
}

export default function ContestCard({
  id,
  variant = "my",
  title,
  hostBy,
  prize,
  endDate,
  entryFee,
  description,
  totalSlots,
  totalParticipants = 0,
  prizePhotoUrl = null,
}) {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinContest, { isLoading: isJoining }] = useJoinContestMutation();

  const detailHref = `contests/${id}?v=${variant}`;
  const isMoneyPrize = !prizePhotoUrl && typeof prize === "number";

  const formattedDate = endDate
    ? new Date(endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const showDateInPrizeRow = variant !== "participated";

  const handleJoinClick = e => {
    e.preventDefault();
    e.stopPropagation();
    setJoinModalOpen(true);
  };

  const handleJoin = async () => {
    try {
      await joinContest(id).unwrap();
      toast.success("Successfully joined the contest!");
      setJoinModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to join contest.");
    }
  };

  const cardContent = (
    <div className="bg-white rounded-[20px] border border-gray-100 p-4 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 gap-2.5">
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
        {prizePhotoUrl ? (
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + "/" + prizePhotoUrl}
            alt={title ?? "Contest"}
            fill
            className="object-cover"
          />
        ) : isMoneyPrize ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-xl font-bold text-black">
              Prize: ${prize.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
      </div>

      {/* ── Info panel: light gray card inset within the white card ── */}
      <div className="bg-[#F7F7F7] rounded-2xl p-4">
        <div className="space-y-3">
          {/* Title */}
          <div className="grid grid-cols-[70px_1fr] items-start gap-3">
            <p className="text-xs text-[#8E8E93]">Title</p>
            <p className="text-base font-semibold text-[#1C1C1E] truncate">
              {title ?? "—"}
            </p>
          </div>

          {/* Host */}
          <div className="grid grid-cols-[70px_1fr] items-start gap-3">
            <p className="text-xs text-[#8E8E93]">Host By</p>
            <p className="text-sm font-medium text-[#1C1C1E]">
              {hostBy ?? "—"}
            </p>
          </div>

          {/* Prize + Date */}
          <div className="grid grid-cols-[70px_1fr] items-start gap-3">
            <p className="text-xs text-[#8E8E93]">Prize</p>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#1C1C1E]">
                {typeof prize === "number"
                  ? `$${prize.toLocaleString()}`
                  : (prize ?? "—")}
              </span>

              {showDateInPrizeRow && formattedDate && (
                <span className="text-sm text-[#1C1C1E]">{formattedDate}</span>
              )}
            </div>
          </div>

          {/* Description + Slots */}
          <div className="grid grid-cols-[70px_1fr] items-start gap-3">
            <p className="text-xs text-[#8E8E93]">Description</p>

            <div className="flex justify-between items-start gap-3">
              <p className="text-sm text-[#1C1C1E] line-clamp-1 flex-1">
                {description ?? "--"}
              </p>

              {typeof totalSlots === "number" && (
                <span className="text-sm text-[#1C1C1E] shrink-0">
                  {totalParticipants}/{totalSlots}
                </span>
              )}
            </div>
          </div>

          {/* Show Slots row only when no description */}
          {!description && typeof totalSlots === "number" && (
            <div className="grid grid-cols-[70px_1fr] items-start gap-3">
              <p className="text-xs text-[#8E8E93]">Slots</p>
              <p className="text-sm text-[#1C1C1E]">
                {totalParticipants}/{totalSlots}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer — varies by variant ── */}
      {variant === "my" && (
        <div>
          <Link
            href={detailHref}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            <Info size={15} />
            Details
          </Link>
        </div>
      )}

      {variant === "contest" && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-black">
            {formatEntryFee(entryFee)}
          </span>
          <button
            type="button"
            onClick={handleJoinClick}
            className="flex-1 max-w-[160px] text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
          >
            Join Contest
          </button>
        </div>
      )}

      {variant === "participated" && (
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-gray-500 shrink-0" />
          <span className="text-sm font-medium text-gray-500">
            End: {formattedDate ?? "—"}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {variant === "my" ? (
        cardContent
      ) : (
        <Link href={detailHref} className="block h-full">
          {cardContent}
        </Link>
      )}

      <JoinContestModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onConfirm={handleJoin}
        isLoading={isJoining}
        contest={{ title, entry_fee: entryFee }}
      />
    </>
  );
}
