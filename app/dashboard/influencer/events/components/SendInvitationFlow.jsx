"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SelectUsersModal from "./SelectUsersModal";
import FilterModal from "./FilterModal";
import PaymentRequiredModal from "./PaymentRequiredModal";
import PaymentAmountModal from "./PaymentAmountModal";

// Mock users data
const MOCK_USERS = [
  { id: 1, name: "Dianne Russell", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Esther Howard", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Theresa Webb", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Ronald Richards", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Cody Fisher", avatar: "https://i.pravatar.cc/150?u=5" },
];

export default function SendInvitationFlow({ open, onClose }) {
  const [step, setStep] = useState("select_users"); // select_users, filter, payment_required, payment_amount
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [country, setCountry] = useState("Bangladesh");

  useEffect(() => {
    if (!open) {
      setStep("select_users");
      setSelectedUsers([]);
      setSearchQuery("");
      setAmount("");
      setCountry("Bangladesh");
    }
  }, [open]);

  if (!open) return null;

  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendInvitationClick = () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to invite.");
      return;
    }
    setStep("payment_required");
  };

  const handlePaymentRequiredNo = () => {
    toast.success("Invitations sent successfully!");
    onClose();
  };

  const handlePaymentRequiredYes = () => {
    setStep("payment_amount");
  };

  const handlePaymentAmountNo = () => {
    toast.success("Invitations sent successfully without payment requirement!");
    onClose();
  };

  const handlePaymentAmountYes = () => {
    if (!amount) {
      toast.error("Please enter an amount.");
      return;
    }
    toast.success(`Invitations sent! Payment required: $${amount}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/*Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(var(--color-primary-rgb), 0.15) 100%)" }}
        />
        <div className="relative z-10 flex flex-col w-full h-full">
          {step === "select_users" && (
          <SelectUsersModal
            users={MOCK_USERS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedUsers={selectedUsers}
            onToggleUser={handleToggleUser}
            onOpenFilter={() => setStep("filter")}
            onSendInvitation={handleSendInvitationClick}
          />
        )}
        
        {step === "filter" && (
          <FilterModal
            country={country}
            setCountry={setCountry}
            onCancel={() => setStep("select_users")}
            onFilter={() => setStep("select_users")}
          />
        )}
        
        {step === "payment_required" && (
          <PaymentRequiredModal
            onNo={handlePaymentRequiredNo}
            onYes={handlePaymentRequiredYes}
          />
        )}
        
        {step === "payment_amount" && (
          <PaymentAmountModal
            amount={amount}
            setAmount={setAmount}
            onNo={handlePaymentAmountNo}
            onYes={handlePaymentAmountYes}
          />
        )}
        </div>
      </div>
    </div>
  );
}
