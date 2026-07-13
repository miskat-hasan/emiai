"use client";

import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import PaymentRequestCard from "../components/PaymentRequestCard";
import SentCollaborationCard from "../components/SentCollaborationCard";
import { paymentRequests } from "../components/Data/collaborationPaymentData";
import CollaborationPaymentModal from "../components/CollaborationPaymentModal";
import IncomingCollaborationCard from "../components/IncomingCollaborationCard";
import { incomingCollaborationRequests } from "../components/Data/collaborationIncomingData";
import { useGetMySentInvitationsQuery } from "@/redux/api/services/eventApi";


const collaborationTabs = [
    {
        label: "Incoming Requests",
        value: "incoming",
    },
    {
        label: "Sent Requests",
        value: "sent",
    },
    {
        label: "Payment Requests",
        value: "payment",
    },
];

export default function CollaborationsPage() {
    const [activeTab, setActiveTab] = useState("incoming");
    const [selectedCollaboration, setSelectedCollaboration] = useState(null);

    const { data: sentInvitationsResponse, isLoading: isLoadingSent } = useGetMySentInvitationsQuery();

    const sentInvitationsData = useMemo(() => {
        const rawData = sentInvitationsResponse?.data || [];
        return rawData.map(item => ({
            id: item.id,
            title: item.event?.title || "Unknown Event",
            host: item.invited_user?.name || "Unknown User",
            status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending",
            statusTone: item.status || "pending",
            amount: item.ticket?.price || 0,
            
            currency: "$", // Default currency
            requestedLabel: "Ticket Price",
            avatar: item.invited_user?.profile_photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
        }));
    }, [sentInvitationsResponse]);

    const collaborations = useMemo(() => {
        if (activeTab === "payment") {
            return paymentRequests;
        }

        if (activeTab === "sent") {
            return sentInvitationsData;
        }

        return incomingCollaborationRequests;
    }, [activeTab, sentInvitationsData]);

    const handleRequestPayment = (item) => {
        setSelectedCollaboration(item);
    };

    const handleAccept = (item) => {
        toast.success("Collaboration request accepted");
    };

    const handleReject = (item) => {
        toast.info("Collaboration request rejected");
    };

    return (
        <section className="w-full">
            <div className="mb-5 flex items-center gap-3">
                {collaborationTabs.map((tab) => {
                    const isActive = activeTab === tab.value;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 ${isActive
                                ? "bg-primary text-white shadow-sm"
                                : "bg-[#f6ded5] text-[#202626] hover:bg-primary hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === "sent" && isLoadingSent ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                    <p className="text-sm font-medium text-[#7a8582]">Loading sent invitations...</p>
                </div>
            ) : collaborations.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                    {collaborations.map((item) =>
                        activeTab === "payment" ? (
                            <PaymentRequestCard
                                key={item.id}
                                item={item}
                                onAccept={handleAccept}
                                onReject={handleReject}
                            />
                        ) : activeTab === "sent" ? (
                            <SentCollaborationCard key={item.id} item={item} />
                        ) : (
                            <IncomingCollaborationCard
                                key={item.id}
                                item={item}
                                onRequestPayment={handleRequestPayment}
                                onAccept={handleAccept}
                                onReject={handleReject}
                            />
                        )
                    )}
                </div>
            ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                    <div>
                        <h3 className="mb-2 text-lg font-bold text-[#252525]">
                            {activeTab === "payment"
                                ? "No payment requests found"
                                : "No collaborations found"}
                        </h3>

                        <p className="text-sm font-medium text-[#7a8582]">
                            {activeTab === "payment"
                                ? "Your payment requests will appear here."
                                : activeTab === "sent"
                                    ? "Your sent requests will appear here."
                                    : "Your collaboration requests will appear here."}
                        </p>
                    </div>
                </div>
            )}

            <CollaborationPaymentModal
                open={Boolean(selectedCollaboration)}
                collaboration={selectedCollaboration}
                onClose={() => setSelectedCollaboration(null)}
            />
        </section>
    );
}