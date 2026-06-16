"use client";

import { useState } from "react";
import { VoucherCard } from "@/components/common/VoucherCard";
import CreateVoucherModal from "@/components/common/CreateVoucherModal";
import VoucherFilterModal from "@/components/common/VoucherFilterModal";
import { useGetVouchersQuery } from "@/redux/api/services/voucherApi";

// Utility to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function VouchersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Fetch vouchers from backend
  const { data: response, isLoading } = useGetVouchersQuery();

  const vouchers = response?.data || [];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Vouchers</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Vouchers</span>
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Vouchers</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 border border-gray/30 rounded-full px-5 py-2 text-sm font-medium hover:bg-gray/5 transition-colors text-black"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.75 3.5H12.25M4.08333 7H9.91667M5.83333 10.5H8.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Filter
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary text-white rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create New Voucher
          </button>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {vouchers.map(voucher => (
          <VoucherCard
            key={voucher.id}
            role="influencer"
            title={`${voucher.discount}${voucher.discount_type === 'percentage' ? '%' : ''} off`}
            description={voucher.description}
            label="Voucher"
            code={voucher.promo_code}
            expiryDate={formatDate(voucher.end_date)}
            onCopy={() => handleCopy(voucher.promo_code)}
          />
        ))}
      </div>

      <CreateVoucherModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        role="influencer"
      />

      <VoucherFilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilter={(data) => {
          console.log("Filtering vouchers with:", data);
          // Refetch or update query with `data` payload
        }}
        role="influencer"
      />
    </div>
  );
}
