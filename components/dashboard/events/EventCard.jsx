import React from "react";
import Image from "next/image";

const EventCard = ({
  imageUrl,
  title = "Digital Marketing Forum 2025",
  location = "Hello this is about my portfolio",
  sponsor = "Event CO.",
  date = "Feb 17, 2026",
  buttonText = "Create Invite",
  onCardClick,
  onButtonClick,
}) => {
  return (
    <div
      onClick={onCardClick}
      className="bg-white border border-gray/20 rounded-[2rem] p-3 w-full shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image Section */}
      <div className="relative w-full h-[220px] rounded-[1.5rem] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </div>

      {/* Details Section */}
      <div className="bg-gray/5 rounded-[1.5rem] p-5 mt-3 flex flex-col gap-3.5">
        {/* Title Row */}
        <div className="flex items-start gap-4">
          <span className="w-20 text-gray text-[15px] shrink-0">Title</span>
          <span className="flex-1 text-black text-[17px] font-medium leading-tight">
            {title}
          </span>
        </div>

        {/* Location Row */}
        <div className="flex items-start gap-4">
          <span className="w-20 text-gray text-[12px] shrink-0">
            Location
          </span>
          <span className="flex-1 text-black text-[12px] leading-snug break-all">
            {location}
          </span>
        </div>

        {/* Sponsored & Date Row */}
        <div className="flex items-center gap-4 mt-1">
          <span className="w-20 text-gray text-[12px] shrink-0">
            Sponsored
          </span>
          <div className="flex-1 flex justify-between items-center text-[12px]">
            <span className="text-black font-medium">{sponsor}</span>
            <span className="text-black">{date}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          onButtonClick?.();
        }}
        className="mt-3 w-full bg-gradient-to-b from-primary to-secondary hover:opacity-90 text-white py-3.5 rounded-2xl font-medium text-[17px] transition-all duration-200 active:scale-[0.98] cursor-pointer"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default React.memo(EventCard);
