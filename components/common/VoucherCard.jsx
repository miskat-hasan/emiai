import React from 'react';
import Image from "next/image";
import { cn } from '@/lib/utils';
import { VoucherBackgroundSVG } from './Svg';

export const VoucherCard = ({
  role = 'influencer',
  title = '20% off',
  description = 'This Vouchers work for free service charge and also use to payout',
  label = 'Vouchers',
  code = 'SUMMER20',
  expiryDate = 'Dec 21, 2025',
  onCopy,
  className
}) => {
  return (
    <div className={cn(`theme-${role} relative w-[350px] h-[450px] mx-auto text-white`, className)}>
      {/* Background SVG */}
      <div className="absolute inset-0 z-0 drop-shadow-md">
        <VoucherBackgroundSVG className="w-full h-full" />
      </div>

      {/* Dashed Line separator for cutouts */}
      <div className="absolute top-[80%] left-8 right-8 border-t border-dashed border-white/50 z-10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-6 px-6 h-full">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-center text-[15px] mb-3 leading-snug max-w-[280px]">
          {description}
        </p>

        <span className="text-sm mb-2">{label}</span>

        {/* Dashed code box */}
        <div className="border border-dashed border-white rounded-lg py-2 px-8 mb-4">
          <span className="text-xl tracking-wider">{code}</span>
        </div>

        {/* Image */}
        <div className="mb-4 rounded-[16px] overflow-hidden bg-black/20 w-[80px] h-[80px] relative">
          <Image
            src="/images/VoucherRectangleImage.png"
            alt="Voucher Image"
            fill
            className="object-cover"
          />
        </div>
        <p className="absolute bottom-[110px] text-[13px] font-medium text-white/90">Expires on: {expiryDate}</p>

        {/* Copy Button */}
        <div className="absolute bottom-6 w-full flex justify-center left-0">
          <button
            onClick={onCopy}
            className="border border-white text-white text-lg rounded-full px-16 py-2 hover:bg-white/10 cursor-pointer transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};
