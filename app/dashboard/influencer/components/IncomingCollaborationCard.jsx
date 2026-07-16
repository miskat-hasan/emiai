"use client";
import Link from "next/link";

const statusStyles = {
    pending: "bg-[#fff7c7] text-[#936800]",
    accepted: "bg-[#f2f2f2] text-[#202626]",
};

export default function IncomingCollaborationCard({
    item,
    onRequestPayment,
    onAccept,
    onReject
}) {
    return (
        <div className="rounded-[14px] border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                        <img
                            src={item.avatar}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div>
                        <Link href={item.detailsUrl || "#"} className="hover:text-primary transition-colors">
                            <h3 className="text-[14px] font-bold leading-tight text-[#202626] hover:text-primary">
                                {item.title}
                            </h3>
                        </Link>

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

            <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#202626]">
                    {item.requestedLabel}
                </p>

                <p className="text-[11px] font-medium text-[#6d7774]">
                    {item.currency}
                    {item.amount}
                </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
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

            <button
                type="button"
                onClick={() => onRequestPayment(item)}
                className="h-10 w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-[11px] font-bold text-white transition-all duration-300 hover:opacity-90"
            >
                Request Payment
            </button>
        </div>
    );
}