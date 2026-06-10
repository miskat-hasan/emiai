import React from "react";
import Image from "next/image";

const MyEventCard = ({
  imageUrl = "/images/demo-event-photo.png",
  title = "Digital Marketing Forum 2025",
  description = "Hello this is about my portfolio",
  organizer = "Event CO.",
  date = "Feb 17, 2026",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
    >
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_60%,rgba(0,0,0,0.55)_80%,rgba(0,0,0,0.85)_100%)]" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
        <p className="text-white font-semibold text-base leading-tight mb-1">
          {title}
        </p>
        <p className="text-white/80 text-xs mb-2 line-clamp-1">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs">{organizer}</span>
          <span className="text-white/70 text-xs">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;
