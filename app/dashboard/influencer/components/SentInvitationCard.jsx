"use client";

const getInitials = (name = "") => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const badgeStyles = {
    pendingYellow: "bg-[#fff7c7] text-[#936800]",
    pendingGreen: "bg-[#dcfce7] text-[#15803d]",
    needToPay: "bg-[#eef2ff] text-[#4f63f6]",
    rejected: "bg-[#ffe1e1] text-[#e00000]",
};

export const sentInvitationRequests = [
    {
        id: 101,
        type: "sent",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
        statusTone: "pendingYellow",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Eleanor Pena",
            avatar:
                "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
    {
        id: 102,
        type: "sent",
        title: "Digital Marketing Forum 2025",
        status: "Need To Pay",
        statusTone: "needToPay",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Cody Fisher",
            avatar:
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
        paymentRequest: {
            amount: 2311,
        },
        primaryAction: "payment_now",
        primaryActionLabel: "Payment Now",
    },
    {
        id: 103,
        type: "sent",
        title: "Digital Marketing Forum 2025",
        status: "Need To Pay",
        statusTone: "needToPay",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Annette Black",
            avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
        paymentRequest: {
            amount: 2311,
        },
        primaryAction: "request_payment",
        primaryActionLabel: "Request Payment",
    },
    {
        id: 104,
        type: "sent",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
        statusTone: "pendingGreen",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Jerome Bell",
            avatar:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
    {
        id: 105,
        type: "sent",
        title: "Digital Marketing Forum 2025",
        status: "Rejected",
        statusTone: "rejected",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Kristin Watson",
            avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
    {
        id: 106,
        type: "sent",
        title: "Digital Marketing Forum 2025",
        status: "Rejected",
        statusTone: "rejected",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Kristin Watson",
            avatar:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
];

export default function SentInvitationCard({
    invitation,
    onRequestPayment,
    onPaymentNow,
}) {
    const hasPaymentRequest = Boolean(invitation.paymentRequest);
    const hasPrimaryAction = Boolean(invitation.primaryAction);

    return (
        <div className="rounded-[18px] border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
                <h3 className="text-[15px] font-bold leading-tight text-[#252525] sm:text-base">
                    {invitation.title}
                </h3>

                <span
                    className={`rounded-xl px-4 py-2 text-xs font-medium ${badgeStyles[invitation.statusTone] || badgeStyles.pendingYellow
                        }`}
                >
                    {invitation.status}
                </span>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-4">
                <div>
                    <p className="mb-1 text-xs font-bold text-[#252525]">Date</p>
                    <p className="text-xs font-medium text-[#7a8582]">
                        {invitation.date}
                    </p>
                </div>

                <div className="text-right">
                    <p className="mb-1 text-xs font-bold text-[#252525]">Location</p>
                    <p className="text-xs font-medium text-[#7a8582]">
                        {invitation.location}
                    </p>
                </div>
            </div>

            <div className="mb-4 rounded-xl bg-[#f6f6f6] p-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary">
                        {invitation.from.avatar ? (
                            <img
                                src={invitation.from.avatar}
                                alt={invitation.from.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                                {getInitials(invitation.from.name)}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-xs font-medium text-[#7a8582]">From:</p>
                        <h4 className="text-sm font-bold text-[#26312f]">
                            {invitation.from.name}
                        </h4>
                    </div>
                </div>

                <p className="text-[13px] font-medium leading-[1.35] text-[#1f2927]">
                    {invitation.message}
                </p>
            </div>

            {hasPaymentRequest && (
                <div className="mb-4 flex h-10 items-center justify-between rounded-xl bg-[#f3f3f3] px-4">
                    <span className="text-xs font-medium text-[#7a8582]">
                        Payment Request
                    </span>

                    <span className="text-xs font-bold text-[#25302e]">
                        SAR {invitation.paymentRequest.amount}
                    </span>
                </div>
            )}

            {hasPrimaryAction && (
                <button
                    type="button"
                    onClick={() => {
                        if (invitation.primaryAction === "request_payment") {
                            onRequestPayment?.(invitation);
                            return;
                        }

                        if (invitation.primaryAction === "payment_now") {
                            onPaymentNow?.(invitation);
                        }
                    }}
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white transition-all duration-300 hover:opacity-90"
                >
                    {invitation.primaryActionLabel}
                </button>
            )}
        </div>
    );
}