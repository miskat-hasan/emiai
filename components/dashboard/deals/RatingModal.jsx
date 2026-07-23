"use client";

import {
  RatingFace1SVG,
  RatingFace2SVG,
  RatingFace3SVG,
  RatingFace4SVG,
  RatingFace5SVG,
  RatingThumbFrownSVG,
  RatingThumbSmileSVG,
  RatingThumbStraightSVG,
} from "@/components/common/Svg";
import { cn } from "@/lib/utils";
import { useState } from "react";

const RATING_COLORS = {
  1: "#C92A6B",
  2: "#F28522",
  3: "#5A2A71",
  4: "#0099A8",
  5: "#1F3C88",
};

const RATING_FACES = {
  1: RatingFace1SVG,
  2: RatingFace2SVG,
  3: RatingFace3SVG,
  4: RatingFace4SVG,
  5: RatingFace5SVG,
};

const THUMB_FACES = {
  1: RatingThumbFrownSVG,
  2: RatingThumbFrownSVG,
  3: RatingThumbStraightSVG,
  4: RatingThumbSmileSVG,
  5: RatingThumbSmileSVG,
};

export const RatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const ActiveFace = RATING_FACES[rating];
  const ActiveThumbFace = THUMB_FACES[rating];
  const activeColor = RATING_COLORS[rating];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[600px] overflow-hidden shadow-2xl relative">
        {/* Background gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-orange-100/60 to-transparent pointer-events-none" />

        <div className="relative z-10 px-8 pt-10 pb-4">
          <h2 className="text-[18px] font-bold text-gray-900 border-b border-gray-100 pb-6">
            How Was Your Experience?
          </h2>
        </div>

        {/* Big Face */}
        <div className="relative z-10 flex justify-center py-8">
          <div
            className="w-56 h-56 transition-colors duration-500"
            style={{ color: activeColor }}
          >
            <ActiveFace />
          </div>
        </div>

        {/* Custom Segmented Slider */}
        <div className="relative z-10 flex justify-center mb-10 px-6 sm:px-12">
          <div className="relative w-full max-w-[400px]">
            {/* Slider track background */}
            <div className="absolute top-1/2 left-4 right-4 h-10 -translate-y-1/2 bg-[#f8f9fa] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"></div>

            {/* Thumbs and dots */}
            <div className="relative flex items-center justify-between w-full">
              {[1, 2, 3, 4, 5].map((val) => (
                <div
                  key={val}
                  className="relative flex items-center justify-center flex-1"
                >
                  {/* Dot */}
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-[#1F3C88]/30" />

                  {/* Thumb */}
                  <button
                    type="button"
                    onClick={() => setRating(val)}
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full transition-all duration-300 relative focus:outline-none z-10"
                  >
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-300 shadow-md",
                        rating === val
                          ? "scale-100 opacity-100"
                          : "scale-[0.2] opacity-0",
                      )}
                      style={{
                        backgroundColor:
                          rating === val ? activeColor : "transparent",
                      }}
                    ></div>
                    {rating === val && (
                      <div className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 text-white">
                        <ActiveThumbFace />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="relative z-10 px-10 mb-8">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Message
          </label>
          <textarea
            rows={4}
            className="w-full bg-[#f8f9fa] border-0 rounded-[16px] p-5 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-[#ea580c] resize-none outline-none"
            placeholder="What is this about...."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-10 pb-10 pt-6 border-t border-gray-100/80 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[#065f46] font-semibold text-md hover:text-[#047857] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ rating, message })}
            disabled={isLoading}
            className="bg-[#f97316] text-white px-6 py-3 rounded-[12px] font-semibold text-md hover:bg-[#ea580c] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {isLoading ? "Submitting..." : "Rate Now"}
          </button>
        </div>
      </div>
    </div>
  );
};
