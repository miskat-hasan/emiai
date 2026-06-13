import React from "react";

export default function PaymentAmountModal({ amount, setAmount, onNo, onYes }) {
  return (
    <div className="p-8 flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Send Invitation</h2>
      <p className="text-gray-600 mb-8 leading-relaxed px-4">
        Your invited members will be required to make a payment to join
      </p>

      <div className="w-full mb-10">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-900 outline-none text-center"
        />
      </div>

      <div className="flex items-center gap-8 w-full justify-center">
        <button
          onClick={onNo}
          className="text-[#018063] font-medium px-4"
        >
          No
        </button>
        <button
          onClick={onYes}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-2.5 rounded-xl font-medium transition-all"
        >
          Yes
        </button>
      </div>
    </div>
  );
}
