import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import Image from "next/image";
import { formatDate } from "@/helper/formatDate";

export default function DealCard({ deal, role }) {
  // const isExtension = status === "Extension";

  // const displayDateLabel = isExtension ? "Extension Date" : "Date";
  // const displayDateValue = isExtension ? extensionDate || date : date;

  // const displayDescLabel = isExtension
  //   ? "Extension Message"
  //   : "Offer Description";
  // const displayDescValue = isExtension
  //   ? extensionMessage || description
  //   : description;

  // const displayPayoutLabel = isExtension ? "Duration" : "Net Payout";
  // const displayPayoutValue = isExtension ? duration || netPayout : netPayout;

  // // The 6th card in mockup (Delivery, Leslie Alexander) doesn't have buttons, but generally Advertiser/Business Manager roles do have them

  // // We'll show actions if role isn't influencer and status is Delivery, Extension, or Completed
  const showActions =
    role !== "influencer" &&
    ["Delivery", "Extension", "Completed"].includes(status);

  return (
    <Link
      href={`/dashboard/${role}/deals/${deal?.id}`}
      className="block group h-full"
    >
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col h-full hover:border-primary/30 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col gap-4 flex-1">
          {/* ── Status row ── */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-black">Status</span>
            <StatusBadge status={deal?.status} />
          </div>

          {/* ── Person + date ── */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-primary to-secondary">
                {deal?.partner?.avatar ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${deal?.partner?.avatar}`}
                    alt={person}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    {deal?.partner?.name?.at(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-black">
                {deal?.partner?.name}
              </span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray">Date</p>
              <p className="text-xs font-medium text-black mt-0.5">
                {formatDate(deal?.created_at)}
              </p>
            </div>
          </div>

          {/* ── Description + payout ── */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-black mb-1">
                Offer Description
              </p>
              <p className="text-xs text-gray line-clamp-2">
                {deal?.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-black mb-1">
                Net Payout
              </p>
              <p className="text-xs font-bold text-black">SAR {deal?.amount}</p>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        {showActions && (
          <div className="flex items-center gap-3 mt-4">
            {status === "Delivery" && (
              <>
                <button
                  onClick={e => e.preventDefault()}
                  className="flex-1 py-2.5 px-2 rounded-full border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={e => e.preventDefault()}
                  className="flex-1 py-2.5 px-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Accept Delivery
                </button>
              </>
            )}
            {status === "Extension" && (
              <>
                <button
                  onClick={e => e.preventDefault()}
                  className="flex-1 py-2.5 px-2 rounded-full border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={e => e.preventDefault()}
                  className="flex-1 py-2.5 px-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Accept Extension
                </button>
              </>
            )}
            {status === "Completed" && (
              <>
                <button
                  onClick={e => e.preventDefault()}
                  className="flex-1 py-2.5 px-2 rounded-full border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {isRatingGiven ? "View Rating" : "Give Rating"}
                </button>
                <button
                  onClick={e => e.preventDefault()}
                  className="flex-1 py-2.5 px-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                >
                  Publish Ads
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
