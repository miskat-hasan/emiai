"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export const invitationTabs = [
    {
        label: "Incoming",
        value: "incoming",
    },
    {
        label: "Sent",
        value: "sent",
    },
];

export const invitationRequests = [
    {
        id: 1,
        type: "incoming",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Annette Black",
            avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
    {
        id: 2,
        type: "incoming",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Lina Armand",
            avatar:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
    {
        id: 3,
        type: "incoming",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Annette Black",
            avatar:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
    {
        id: 4,
        type: "incoming",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
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
        id: 5,
        type: "incoming",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
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
        id: 6,
        type: "incoming",
        title: "Digital Marketing Forum 2025",
        status: "Pending",
        date: "Feb 12, 2026",
        location: "Dhaka, Bangladesh",
        from: {
            name: "Marvin McKinney",
            avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
        },
        message:
            "Hey Apurbo! What do you think about attending the Digital Marketing Forum with us? Your presence would add a lot to the event and it would be a great opportunity to meet and talk about future collaborations. See you there?",
    },
];

const getInitials = (name = "") => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const InvitationCard = ({ invitation, onRequestPayment }) => {
    return (
        <div className="rounded-[18px] border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
                <h3 className="text-[15px] font-bold leading-tight text-[#252525] sm:text-base">
                    {invitation.title}
                </h3>

                <span className="rounded-xl bg-[#fff7c7] px-4 py-2 text-xs font-medium text-[#936800]">
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

                <p className="text-[12px] font-medium leading-[1.35] text-[#1f2927]">
                    {invitation.message}
                </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
                <button
                    type="button"
                    className="h-10 rounded-xl border border-secondary bg-white text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
                >
                    Reject
                </button>

                <button
                    type="button"
                    className="h-10 rounded-xl bg-[#f3f3f3] text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white"
                >
                    Accept
                </button>
            </div>

            <button
                type="button"
                onClick={() => onRequestPayment(invitation)}
                className="h-11 w-full rounded-xl bg-[linear-gradient(90deg,_#F57802_0%,_#EB4A35_100%)] text-xs font-bold text-white transition-all duration-300 hover:opacity-90"
            >
                Request Payment
            </button>
        </div>
    );
};

const RequestPaymentModal = ({ open, invitation, onClose }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            amount: "",
            note: "",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data) => {
        const payload = {
            invitationId: invitation?.id,
            memberName: invitation?.from?.name,
            paymentAmount: data.amount,
            note: data.note,
        };

        console.log("Payment request payload:", payload);

        toast.success("Payment request sent successfully");
        handleClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="relative w-full max-w-[530px] rounded-[22px] bg-white px-5 py-8 shadow-2xl sm:px-10 sm:py-10">
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-[#60706c] transition-all duration-300 hover:bg-secondary hover:text-white"
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                <div className="mb-8 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-[#2f3433]">
                        Request payment
                    </h2>

                    <p className="mx-auto max-w-[360px] text-lg font-medium leading-[1.35] text-[#2f3a38]">
                        Your invited members will be required to make a payment to join
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label className="mb-3 block text-lg font-semibold text-[#667471]">
                            Payment Amount
                        </label>

                        <input
                            type="number"
                            min="1"
                            step="any"
                            placeholder="Enter amount"
                            className="h-[62px] w-full rounded-xl border border-transparent bg-[#f7f7f7] px-5 text-lg font-medium text-[#26312f] outline-none transition-all duration-300 placeholder:text-[#26312f] focus:border-primary focus:bg-white"
                            {...register("amount", {
                                required: "Payment amount is required",
                                min: {
                                    value: 1,
                                    message: "Amount must be greater than 0",
                                },
                            })}
                        />

                        {errors.amount && (
                            <p className="mt-2 text-sm font-medium text-secondary">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <label className="mb-3 block text-lg font-semibold text-[#667471]">
                            Note
                        </label>

                        <textarea
                            rows={5}
                            placeholder="Add a message here..."
                            className="w-full resize-none rounded-xl border border-transparent bg-[#f7f7f7] px-5 py-5 text-lg font-medium text-[#26312f] outline-none transition-all duration-300 placeholder:text-[#26312f] focus:border-primary focus:bg-white"
                            {...register("note", {
                                maxLength: {
                                    value: 250,
                                    message: "Note cannot be more than 250 characters",
                                },
                            })}
                        />

                        {errors.note && (
                            <p className="mt-2 text-sm font-medium text-secondary">
                                {errors.note.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="h-[54px] min-w-[130px] rounded-xl text-lg font-semibold text-[#004f49] transition-all duration-300 hover:bg-[#f3f3f3]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-[54px] min-w-[175px] rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-lg font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Sending..." : "Send Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState("incoming");
    const [selectedInvitation, setSelectedInvitation] = useState(null);

    const filteredInvitations = useMemo(() => {
        return invitationRequests.filter((item) => item.type === activeTab);
    }, [activeTab]);

    return (
        <section className="w-full">
            <div className="mb-5 flex items-center gap-3">
                {invitationTabs.map((tab) => {
                    const isActive = activeTab === tab.value;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`rounded-xl px-5 py-2 text-xs font-bold transition-all duration-300 ${isActive
                                ? "bg-primary text-white shadow-sm"
                                : "bg-[#f6ded5] text-[#533c36] hover:bg-primary hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {filteredInvitations.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
                    {filteredInvitations.map((invitation) => (
                        <InvitationCard
                            key={invitation.id}
                            invitation={invitation}
                            onRequestPayment={setSelectedInvitation}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                    <div>
                        <h3 className="mb-2 text-lg font-bold text-[#252525]">
                            No {activeTab} requests found
                        </h3>
                        <p className="text-sm font-medium text-[#7a8582]">
                            Your {activeTab} event invitations will appear here.
                        </p>
                    </div>
                </div>
            )}

            <RequestPaymentModal
                open={Boolean(selectedInvitation)}
                invitation={selectedInvitation}
                onClose={() => setSelectedInvitation(null)}
            />
        </section>
    );
}