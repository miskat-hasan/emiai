import React from "react";

export default function EventLocation({ mapUrl }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Event Live location
      </h2>
      <hr className="my-5 border-gray-200" />
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
          ></iframe>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            Map URL not provided
          </div>
        )}
      </div>
    </div>
  );
}
