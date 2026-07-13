"use client";

import Image from "next/image";
import { Bookmark, Star } from "lucide-react";

/**
 * AgencyCard
 * Used in: Agencies page, potentially other dashboards
 *
 * Props:
 *  - id, name, avatar, rating (number), reviewCount
 *  - categories: string[]
 *  - commission: string  e.g. "10%"
 *  - successfulDeals: number
 *  - bookmarked: boolean
 *  - onContact, onBookmark
 */
export default function AgencyCard({
  id,
  name = "Annette Black",
  avatar = null,
  rating = 4.9,
  reviewCount,
  categories = ["Fashion", "Beauty", "Lifestyle"],
  commission = "10%",
  successfulDeals = 50,
  bookmarked = false,
  onContact,
  onBookmark,
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 relative">
      {/* Bookmark */}
      <button
        onClick={onBookmark}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-primary/40 transition-colors shadow-sm cursor-pointer"
      >
        <Bookmark
          className={`size-4 ${bookmarked ? "fill-primary text-primary" : "text-[#63716E]"}`}
        />
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className="w-24 h-24 xl:size-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
          {avatar ? (
            <Image src={avatar?.startsWith("http") ? avatar : `${process.env.NEXT_PUBLIC_API_URL}/${avatar?.startsWith('/') ? avatar.slice(1) : avatar}`} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{name[0]}</span>
            </div>
          )}
        </div>
        <h3 className="mt-3 text-base lg:text-lg xl:text-xl font-bold text-[#203430]">
          {name}
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-1 mt-1.5 xl:mt-2">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star
              key={`f${i}`}
              className="fill-yellow-400 text-yellow-400 size-5"
            />
          ))}
          {hasHalf && (
            <Star className="fill-yellow-400 text-yellow-400 opacity-60 size-5" />
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star key={`e${i}`} size={14} className="text-gray-300" />
          ))}
          <span className="text-xs sm:text-sm text-[#63716E] ml-1">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
          {categories.map(c => (
            <span
              key={c}
              className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 py-3 grid grid-cols-2 gap-2 text-center bg-[#F7F7F7] rounded-xl">
        <div>
          <p className="text-xs sm:text-base font-medium text-[#203430]">
            Commission
          </p>
          <p className="text-lg sm:text-xl font-semibold text-[#203430] mt-0.5">
            {commission}
          </p>
        </div>
        <div className="border-l border-gray-100">
          <p className="text-xs sm:text-base font-medium text-[#203430]">
            Successful Deals
          </p>
          <p className="text-lg sm:text-xl font-semibold text-[#203430] mt-0.5">
            {successfulDeals}
          </p>
        </div>
      </div>

      {/* Contact button */}
      <div className="px-4 pb-4">
        <button
          onClick={onContact}
          className="w-full py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
        >
          Contact
        </button>
      </div>
    </div>
  );
}
