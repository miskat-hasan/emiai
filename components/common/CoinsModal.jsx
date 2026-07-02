"use client";

import { useState } from "react";
import { Zap, X } from "lucide-react";
import RedeemModal from "./RedeemModal";

export default function CoinsModal({ open, onClose }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  if (!open) return null;

  // Mock data for the coin packages
  const packages = [
    { id: 1, amount: 10, image: "/images/10 coins.png" },
    { id: 2, amount: 20, image: "/images/20 coins.png" },
    { id: 3, amount: 50, image: "/images/50 coins.png" },
    { id: 4, amount: 100, image: "/images/100 coins.png" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex flex-col transform transition-all duration-300 scale-100 opacity-100">
        {/* Gradient Overlay at bottom */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(var(--color-primary-rgb), 0.08) 100%)" }}
        />

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">Coin</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(var(--color-primary-rgb),0.1)] rounded-full shadow-sm border border-[rgba(var(--color-primary-rgb),0.2)]">
                <Zap size={14} className="text-primary fill-primary" />
                <span className="text-sm font-semibold text-primary">10</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  setSelectedPackage(pkg);
                }}
              >
                <div className="w-full aspect-[4/3] bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-center mb-4 group-hover:border-primary group-hover:shadow-[0_4px_14px_rgba(var(--color-primary-rgb),0.25)] transition-all relative">
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(var(--color-primary-rgb), 0.08) 100%)" }}
                  />
                  <img
                    src={`/images/${pkg.amount}%20coins.png`}
                    alt={`${pkg.amount} Coins`}
                    className="w-[85%] h-[85%] object-contain mix-blend-multiply"
                  />
                </div>
                <span className="text-[17px] font-medium text-black">
                  {pkg.amount} Coin
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RedeemModal
        open={!!selectedPackage}
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />
    </div>
  );
}
