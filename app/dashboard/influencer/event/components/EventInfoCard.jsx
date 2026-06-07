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
    <div className="bg-[#fff8f3] rounded-[2rem] p-6 md:p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Event Information
      </h2>
      <hr className="my-4 border-gray-200" />
      <div className="flex flex-col gap-4">
        {infoData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-[15px]"
          >
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-900 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
