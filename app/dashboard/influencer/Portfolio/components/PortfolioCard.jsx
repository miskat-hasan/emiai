"use client";

import { Eye, Heart } from "lucide-react";
import Image from "next/image";

export default function PortfolioCard({ item, onClick }) {
  return (
    <div
      onClick={() => onClick?.(item.id)}
      className="cursor-pointer rounded-2xl bg-white border border-[#E5E6E6] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="overflow-hidden bg-white">
        <div className="h-[212px] w-full overflow-hidden bg-[#f3f3f3]">
          <Image
            src={item.image}
            alt={item.title}
            className="h-full w-full rounded-[14px] object-cover transition-all duration-500 hover:scale-105"
            width={400}
            height={212}
          />
        </div>

        <div className="pb-4 pt-3">
          <div className="mb-3 flex items-center gap-4 text-gray">
            <div className="flex items-center gap-1.5">
              <Heart size={19} strokeWidth={1.8} />
              <span className="text-xs font-medium">{item.likes}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Eye size={19} strokeWidth={1.8} />
              <span className="text-xs font-medium">{item.views}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[10px] bg-[#f8f8f8]">
            <div className="grid grid-cols-[70px_1fr] border-b border-[#eeeeee]">
              <div className="px-3 py-2 text-[11px] font-medium text-gray">
                Title
              </div>

              <div className="truncate px-3 py-2 text-[11px] font-semibold text-[#202626]">
                {item.title}
              </div>
            </div>

            <div className="grid grid-cols-[70px_1fr]">
              <div className="px-3 py-2 text-[11px] font-medium text-gray">
                Details
              </div>

              <div className="truncate px-3 py-2 text-[11px] font-semibold text-[#202626]">
                {item.details}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
