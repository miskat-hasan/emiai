"use client";

import Image from "next/image";

const statusStyles = {
    pending: "bg-[#fff7c7] text-[#936800]",
    accepted: "bg-[#f2f2f2] text-[#202626]",
};

export default function SentCollaborationCard({ item }) {
    return (
        <div className="rounded-[14px] border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                        <Image
                            src={item.avatar}
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
                    className={`rounded-xl px-5 py-2 text-[11px] font-medium ${statusStyles[item.statusTone] || statusStyles.pending
                        }`}
                >
                    {item.status}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#202626]">
                    {item.requestedLabel}
                </p>

                <p className="text-[11px] font-medium text-[#6d7774]">
                    {item.currency}
                    {item.amount}
                </p>
            </div>
        </div>
    );
}