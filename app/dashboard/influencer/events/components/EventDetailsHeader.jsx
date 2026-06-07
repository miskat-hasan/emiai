import React from "react";
import { Bookmark, QrCode, Share2 } from "lucide-react";

export default function EventDetailsHeader({ title }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
          <Bookmark size={20} />
        </button>
        <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
          <QrCode size={20} />
        </button>
        <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
          <Share2 size={20} />
        </button>
        <button className="px-6 py-2.5 bg-gradient-to-r from-[#f77721] to-[#f04f37] hover:from-[#ea6615] hover:to-[#e33e25] text-white font-medium rounded-full transition-all">
          Join The Event
        </button>
      </div>
    </div>
  );
}
