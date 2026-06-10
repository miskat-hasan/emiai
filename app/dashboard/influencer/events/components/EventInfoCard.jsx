import React from "react";

const DEFAULT_INFO = [
  { label: "Event Type", value: "Offline" },
  { label: "Participants", value: "213" },
  { label: "Sponsored", value: "Events CO." },
  { label: "Location", value: "Dhaka, Bangladesh" },
  { label: "Event Start", value: "Feb 15, 2026" },
];

export default function EventInfoCard({ items = DEFAULT_INFO }) {
  return (
    <div className="bg-primary/5 rounded-3xl p-6 md:p-8 border border-primary/10 h-full">
      <h2 className="text-lg font-bold text-black mb-4">
        Event Information
      </h2>
      <hr className="border-primary/10 mb-4" />
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-gray font-medium">{item.label}</span>
            <span className="font-semibold text-black text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
