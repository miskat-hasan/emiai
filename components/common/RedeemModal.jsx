"use client";

export default function RedeemModal({ open, onClose, pkg }) {
  if (!open || !pkg) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center p-8 transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Gradient Overlay at bottom */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(240, 90, 40, 0.08) 100%)" }}
        />

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Coin Image */}
          <div className="w-[200px] h-[160px] flex items-center justify-center mb-6">
            <img 
              src={pkg.image} 
              alt={`${pkg.amount} Coins`} 
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          <h2 className="text-[32px] font-bold text-black mb-2">Redeem</h2>
          <p className="text-[20px] text-black font-medium mb-10">
            {pkg.amount} Coin
          </p>

          <button
            onClick={() => {
              // Simulate redeem action
              alert(`Redeemed ${pkg.amount} coins successfully!`);
              onClose();
            }}
            className="w-[90%] py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[18px] font-medium hover:opacity-90 transition-opacity shadow-[0_8px_20px_rgba(240,90,40,0.25)]"
          >
            Redeem Now
          </button>
        </div>
      </div>
    </div>
  );
}
