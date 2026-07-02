import React from "react";

export default function PaymentRequiredModal({ onNo, onYes }) {
  return (
    <div className="p-8 flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-black mb-4">Send Invitation</h2>
      <p className="text-gray mb-10 leading-relaxed px-4">
        Your invited members will be required to make a payment to join
      </p>

      <div className="flex items-center gap-8 w-full justify-center">
        <button
          onClick={onNo}
          className="text-gray hover:text-black font-medium px-4 transition-colors"
        >
          No
        </button>
        <button
          onClick={onYes}
          className="bg-gradient-to-b from-primary to-secondary hover:opacity-90 text-white px-8 py-2.5 rounded-xl font-medium transition-all"
        >
          Yes
        </button>
      </div>
    </div>
  );
}
