import React from "react";

export default function EventLocation({ mapUrl }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-bold text-black mb-4">
        Event Live location
      </h2>
      <hr className="border-gray-200 mb-4" />
      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-gray-100">
        {mapUrl ? (
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute top-0 left-0 w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray">
            Map URL not provided
          </div>
        )}
      </div>
    </div>
  );
}
