// components/dashboard/contests/ContestCard.jsx
import Image from "next/image";
import Link from "next/link";
import { Info, CalendarDays } from "lucide-react";

export default function ContestCard({
  id,
  variant = "my",
  title = "Best Summer Fashion Reel",
  hostBy = "A. R. Rahman",
  prize,
  endDate,
  entryFee,
  description = "Show your best summer f...",
  totalSlots = 100,
  totalParticipants = 45,
  prizePhotoUrl = null,
  href,
  onJoin,
}) {
  const detailHref =
    href ?? `/dashboard/influencer/contests/${id}?v=${variant}`;
  const isMoneyPrize = !prizePhotoUrl && typeof prize === "number";

  const formattedDate = endDate
    ? new Date(endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const showDateInPrizeRow = variant !== "participated";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* ── Thumbnail / Price overlay ── */}
      <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
        {prizePhotoUrl ? (
          <Image
            src={prizePhotoUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : isMoneyPrize ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-xl font-bold text-black">
              Prices: ${prize.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
      </div>

      {/* ── Info rows ── */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-gray">Title</span>
          <span className="text-xs font-bold text-black text-right truncate max-w-[60%]">
            {title}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-gray">Host By</span>
          <span className="text-xs font-semibold text-black">{hostBy}</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-gray">Prize</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-black">
              {typeof prize === "number" ? `$${prize.toLocaleString()}` : prize}
            </span>
            {showDateInPrizeRow && formattedDate && (
              <span className="text-xs text-gray">{formattedDate}</span>
            )}
          </div>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-gray">Description</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray truncate max-w-[120px]">
              {description}
            </span>
            <span className="text-xs text-gray shrink-0">
              {totalParticipants}/{totalSlots}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom — MY CONTEST: gradient Details button ── */}
      {variant === "my" && (
        <div className="px-4 pb-4">
          <Link
            href={detailHref}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            <Info size={15} />
            Details
          </Link>
        </div>
      )}

      {/* ── Bottom — CONTEST: entry fee left + Join Contest right ── */}
      {variant === "contest" && (
        <div className="px-4 pb-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-black">
            {entryFee && Number(entryFee) > 0
              ? `$${Number(entryFee).toLocaleString()}`
              : "Free"}
          </span>
          <button
            onClick={onJoin}
            className="flex-1 max-w-[160px] py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            Join Contest
          </button>
        </div>
      )}

      {/* ── Bottom — PARTICIPATED: calendar + end date ── */}
      {variant === "participated" && (
        <div className="px-4 pb-4 flex items-center gap-2">
          <CalendarDays size={15} className="text-gray shrink-0" />
          <span className="text-sm font-medium text-gray">
            End: {formattedDate ?? "—"}
          </span>
        </div>
      )}
    </div>
  );
}
