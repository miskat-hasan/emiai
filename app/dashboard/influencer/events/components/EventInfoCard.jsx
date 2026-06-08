import React from "react";

const infoData = [
  { label: "Event Type", value: "Offline" },
  { label: "Participants", value: "213" },
  { label: "Sponsored", value: "Events CO." },
  { label: "Location", value: "Dhaka, Bangladesh" },
  { label: "Event Start", value: "Feb 15, 2026" },
];

export default function EventInfoCard() {
  return (
    <div className="bg-orange-50 rounded-3xl p-6 md:p-8 border border-orange-100">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        Event Information
      </h2>
      <hr className="my-5 border-orange-100" />
      <div className="flex flex-col gap-4">
        {infoData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-[14px]"
          >
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="font-semibold text-gray-900 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
