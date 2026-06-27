import React from "react";

const DEFAULT_INFO = [
  { label: "Ads Create", value: "Jane Smith" },
  { label: "Prize Number", value: "03" },
  { label: "Publish Time", value: "11:59 PM" },
  { label: "Publish Date", value: "Feb 15, 2026" },
];

export default function AdInfoCard({ items = DEFAULT_INFO }) {
  return (
    <div className="bg-gradient-to-b from-white to-primary/7 rounded-3xl p-6 md:p-8 border border-primary/10">
      <h2 className="text-lg font-bold text-black mb-4">Ads Information</h2>
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
