import React from "react";

const AdCardSkeleton = () => (
  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-200 animate-pulse">
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10 flex items-center gap-3 w-full">
      <div className="w-11 h-11 rounded-full bg-gray-300 shrink-0 border-2 border-white/30"></div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  </div>
);

export default React.memo(AdCardSkeleton);
