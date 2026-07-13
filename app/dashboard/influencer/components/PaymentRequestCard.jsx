"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import Image from "next/image";

const paymentStatusStyles = {
    pending: "bg-[#fff7c7] text-[#936800]",
    paid: "bg-[#e3f5e8] text-[#0b7a3e]",
    processing: "bg-[#e0f0ff] text-[#0066cc]",
};

export default function PaymentRequestCard({ item, onAccept, onReject }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="rounded-[14px] border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                        <Image
                            src={getImageUrl(item.avatar)}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                        />
                    </div>

                    <div>
                        <h3 className="text-[14px] font-bold leading-tight text-[#202626]">
                            {item.title}
                        </h3>

                        <p className="mt-1 text-[11px] font-medium text-[#6d7774]">
                            By {item.host}
                        </p>
                    </div>
                </div>

                <span
                    className={`rounded-xl px-5 py-2 text-[11px] font-medium ${
                        paymentStatusStyles[item.paymentStatusTone] || paymentStatusStyles.pending
                    }`}
                >
                    {item.paymentStatus}
                </span>
            </div>

            <div className="mb-3 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-[#6d7774]">
                        Requested Date
                    </span>
                    <span className="mt-0.5 text-[11px] font-semibold text-[#202626]">
                        {formatDate(item.date)}
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-medium text-[#6d7774]">
                        Amount
                    </span>
                    <span className="mt-0.5 text-[13px] font-bold text-[#202626]">
                        {item.currency}
                        {item.amount.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onReject?.(item)}
                    className="h-9 rounded-lg border border-secondary bg-white text-[11px] font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
                >
                    Reject
                </button>

                <button
                    type="button"
                    onClick={() => onAccept?.(item)}
                    className="h-9 rounded-lg bg-[#f2f2f2] text-[11px] font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}
