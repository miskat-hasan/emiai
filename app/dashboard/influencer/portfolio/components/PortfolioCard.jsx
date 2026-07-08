"use client";

import Image from "next/image";
import { Eye, Heart, Pencil } from "lucide-react";

export default function PortfolioCard({ item, onClick, onUpdate }) {
  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdate?.(item);
  };

  return (
    <div
      onClick={() => onClick?.(item.id)}
      className="group cursor-pointer rounded-2xl bg-white border border-[#E5E6E6] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative"
    >
      {/* Update button */}
      {onUpdate && (
        <button
          onClick={handleUpdate}
          className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-lg"
          title="Update Portfolio"
        >
          <Pencil size={15} className="text-gray-600" />
        </button>
      )}

      <div className="overflow-hidden bg-white">
        <div className="h-70 w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            className="h-full w-full rounded-[14px] object-center transition-all duration-500 hover:scale-105"
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
