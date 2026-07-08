import React from "react";
import Image from "next/image";

const MyEventCard = ({
  imageUrl,
  title = "Digital Marketing Forum 2025",
  description = "Hello this is about my portfolio",
  organizer = "Event CO.",
  date = "Feb 17, 2026",
  onClick,
  onEditClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
    >
      {/* Edit button */}
      {onEditClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-sm"
          title="Edit Event"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.376 3.622a2.12 2.12 0 1 1 2.998 2.999L7.382 18.61a4.5 4.5 0 0 1-1.742 1.054l-3.554 1.18a.33.33 0 0 1-.417-.416l1.18-3.554a4.5 4.5 0 0 1 1.054-1.742L16.376 3.622z" />
          </svg>
        </button>
      )}

      {/* Background image */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 transition-transform duration-300 group-hover:scale-105" />
      )}

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

export default React.memo(MyEventCard);
