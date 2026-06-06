"use client";

import Image from "next/image";
import { Heart, Eye } from "lucide-react";

export default function PortfolioCard({ item, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden p-3 pb-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Heart size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="text-xs font-bold text-black">{item.likes}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
          <span className="text-xs font-bold text-black">{item.views}</span>
        </div>
      </div>

      <hr className="border-gray-50 mx-5" />

      {/* Content Details Block */}
      <div className="p-5 space-y-3">
        <div className="flex items-start">
          <span className="text-[10px] font-bold text-gray uppercase w-16 shrink-0 mt-0.5">Title</span>
          <h4 className="text-sm font-bold text-black truncate">{item.title}</h4>
        </div>
        <div className="flex items-start">
          <span className="text-[10px] font-bold text-gray uppercase w-16 shrink-0 mt-0.5">Details</span>
          <p className="text-xs font-medium text-gray line-clamp-2 leading-relaxed">
            {item.details || "Hello this is about my p..."}
          </p>
        </div>
      </div>
    </div>
  );
}