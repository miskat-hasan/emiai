import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import Image from "next/image";

export default function DealCard({
  id,
  status = "Pending",
  person = "Lina Armand",
  avatar = null,
  date = "Feb 24, 2026",
  description = "I need a video Ads for my Cyberpunk 2077 Game lunching",
  netPayout = "SAR 4500",
  href,
}) {
  const detailHref = href ?? `/dashboard/influencer/deals/${id}`;

  return (
    <Link href={detailHref} className="block group">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-4 h-full hover:border-primary/30 hover:shadow-md transition-all duration-200">
        {/* ── Status row ── */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#203430]">Statas</span>
          <StatusBadge status={status} />
        </div>

        {/* ── Person + date ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-primary to-secondary">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={person}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {person?.[0] ?? "?"}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-[#203430]">
              {person}
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-[#63716E]">Date</p>
            <p className="text-xs font-medium text-[#203430]">{date}</p>
          </div>
        </div>

        {/* ── Description + payout ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#203430] mb-1">
              Offer Description
            </p>
            <p className="text-xs text-[#63716E] line-clamp-2">{description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-[#203430]">Net Payout</p>
            <p className="text-xs font-bold text-[#203430] mt-0.5">
              {netPayout}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
