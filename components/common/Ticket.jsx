'use client';
import { getImageUrl } from "@/helper/getImageUrl";

import { useState } from 'react';
import Image from "next/image";
import { cn } from '@/lib/utils';
import { TicketSVG, StarSVG, DownloadIconSVG } from './Svg';
import { QRCodeSVG } from 'qrcode.react';

export const Ticket = ({ title, qrCode, ticketNumber, className, onDownload }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full max-w-[600px] aspect-[564/241] cursor-pointer [perspective:1000px] mx-auto group [container-type:inline-size]",
        className
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "w-full h-full transition-transform duration-700 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front Side */}
        <div className={cn(
          "absolute inset-0 w-full h-full [backface-visibility:hidden]",
          isFlipped ? "pointer-events-none" : ""
        )}>
          {/* Ticket Background SVG */}
          <TicketSVG className="absolute inset-0 w-full h-full z-0 drop-shadow-xl" />

          {/* Inner Content Front */}
          <div className="absolute inset-0 z-10 px-[11%] py-[4%] flex">
            {/* White Border Frame */}
            <div className="flex-1 border-[0.3cqw] border-white flex">
              {/* Main Ticket Info */}
              <div className="flex-[3.5] flex flex-col items-center justify-center border-r-[0.3cqw] border-white/80 px-[2cqw] py-[1cqw]">
                {/* ★ Event Ticket ★ */}
                <div className="flex items-center gap-[1.5cqw]">
                  <StarSVG className="w-[2.5cqw] h-[2.5cqw] text-white" />
                  <span className="text-white text-[3.5cqw] font-bold tracking-wider">Event Ticket</span>
                  <StarSVG className="w-[2.5cqw] h-[2.5cqw] text-white" />
                </div>

                {/* TICKET texture image */}
                <div className="relative w-[80%] h-[40%] my-[1.5cqw]">
                  <Image
                    src="/images/ticket-texture.png"
                    alt="TICKET"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Event Title */}
                <p className="text-white text-[2.5cqw] font-medium tracking-wide">
                  {title}
                </p>
              </div>

              {/* Ticket Number */}
              <div className="flex-[1] flex items-center justify-center">
                <p
                  className="text-white text-[3.5cqw] font-bold tracking-[0.2em] select-none underline underline-offset-[1cqw] decoration-[0.3cqw]"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {ticketNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className={cn(
          "absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]",
          !isFlipped ? "pointer-events-none" : ""
        )}>
          {/* Ticket Background SVG */}
          <TicketSVG className="absolute inset-0 w-full h-full z-0 drop-shadow-xl" />

          {/* Inner Content Back */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* QR Code Container */}
            <div className="relative p-[3cqw]">
              {/* QR Image */}
              <div className="w-[30cqw] h-[30cqw] relative bg-transparent flex items-center justify-center bg-white p-2">
                <QRCodeSVG 
                  value={ticketNumber || "UNKNOWN"}
                  width="100%"
                  height="100%"
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                />
              </div>
            </div>

            {/* Download Button */}
            <button
              type="button"
              className="absolute top-[4cqw] right-[6cqw] cursor-pointer hover:scale-110 transition-transform z-50 bg-transparent border-none outline-none p-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // prevent flipping when clicking download
                e.nativeEvent.stopImmediatePropagation();
                console.log("Download button clicked for ticket:", ticketNumber);
                if (onDownload) {
                  onDownload();
                }
              }}
            >
              <DownloadIconSVG className="w-[7cqw] h-[7cqw] text-white pointer-events-none" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
