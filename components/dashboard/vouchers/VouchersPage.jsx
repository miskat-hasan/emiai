"use client";

import { useState } from "react";
import { VoucherCard } from "@/components/common/VoucherCard";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useGetVouchersQuery } from "@/redux/api/services/voucherApi";

const CreateVoucherModal = dynamic(() => import("@/components/common/CreateVoucherModal"), { ssr: false });
const VoucherFilterModal = dynamic(() => import("@/components/common/VoucherFilterModal"), { ssr: false });

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

export default function VouchersPage({ role }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Fetch vouchers from backend
  const { data: response, isLoading } = useGetVouchersQuery(filters);

  const vouchers = response?.data?.data || [];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Promo code copied to clipboard!");
  };

  return (
    <div className="space-y-6 font-dm-sans">
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
            className="flex items-center gap-2 border border-gray/30 rounded-full px-5 py-2 text-sm font-medium hover:bg-gray/5 transition-colors text-black cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.75 3.5H12.25M4.08333 7H9.91667M5.83333 10.5H8.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Filter
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {role !== "guest" && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              Create New Voucher
            </button>
          )}
        </div>
      </div>

      {/* Vouchers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse w-full max-w-[350px] mx-auto h-[450px]"
            >
              <div className="p-6 flex flex-col items-center h-full pt-10">
                {/* Title */}
                <div className="h-8 bg-gray-200 rounded-full w-2/3 mb-4" />
                {/* Description */}
                <div className="h-4 bg-gray-200 rounded-full w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded-full w-4/5 mb-6" />
                {/* Code box */}
                <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-6" />
                {/* Image */}
                <div className="h-[80px] w-[80px] bg-gray-200 rounded-[16px] mb-8" />
                {/* Copy Button */}
                <div className="h-10 bg-gray-200 rounded-full w-3/4 mt-auto mb-4" />
              </div>
            </div>
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray col-span-full">
          <p className="text-base font-medium">No vouchers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              role={role}
              title={`${voucher.discount}${voucher.discount_type === 'percentage' ? '%' : ''} off`}
              description={voucher.description}
              label="Voucher"
              code={voucher.promo_code}
              expiryDate={formatDate(voucher.end_date)}
              onCopy={() => handleCopy(voucher.promo_code)}
            />
          ))}
        </div>
      )}

      <CreateVoucherModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        role={role}
      />

      <VoucherFilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilter={(data) => {
          const processedFilters = { ...data };
          if (processedFilters.country_id) {
            processedFilters.country = processedFilters.country_id;
            delete processedFilters.country_id;
          }
          // Remove empty keys
          Object.keys(processedFilters).forEach(key => {
            if (!processedFilters[key]) {
              delete processedFilters[key];
            }
          });
          setFilters(processedFilters);
        }}
        role={role}
      />
    </div>
  );
}
