"use client";

import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import PaymentRequestCard from "../components/PaymentRequestCard";
import SentCollaborationCard from "../components/SentCollaborationCard";
import CollaborationPaymentModal from "../components/CollaborationPaymentModal";
import IncomingCollaborationCard from "../components/IncomingCollaborationCard";
import { useGetMySentInvitationsQuery } from "@/redux/api/services/eventApi";
import { useGetCollaboratorsQuery, useGetPaymentRequestedInvitationsQuery, useActionInvitationMutation } from "@/redux/api/services/collaboratosApi";


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
    const { data: incomingInvitationsResponse, isLoading: isLoadingIncoming } = useGetCollaboratorsQuery();
    const { data: paymentRequestedResponse, isLoading: isLoadingPayment } = useGetPaymentRequestedInvitationsQuery();
    const [actionInvitation] = useActionInvitationMutation();

    const sentInvitationsData = useMemo(() => {
        const rawData = sentInvitationsResponse?.data || [];
        return rawData.map(item => {
            let detailsUrl = "#";
            let contentTitle = "Unknown Content";
            if (item.event) {
                detailsUrl = `/dashboard/influencer/events/${item.event_id || item.event?.id}`;
                contentTitle = item.event?.title;
            } else if (item.ad) {
                detailsUrl = `/dashboard/influencer/ads/${item.ad_id || item.ad?.id}`;
                contentTitle = item.ad?.title;
            } else if (item.contest) {
                detailsUrl = `/dashboard/influencer/contests/${item.contest_id || item.contest?.id}`;
                contentTitle = item.contest?.title;
            }

            return {
                id: item.id,
                title: contentTitle || "Unknown Event",
                detailsUrl,
                host: item.invited_user?.name || "Unknown User",
                status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending",
                statusTone: item.status || "pending",
                amount: item.ticket?.price || 0,
                currency: "$",
                requestedLabel: "Ticket Price",
                avatar: item.invited_user?.avatar,
            };
        });
    }, [sentInvitationsResponse]);

    const incomingInvitationsData = useMemo(() => {
        const rawData = incomingInvitationsResponse?.data || [];
        return rawData.map(item => {
            let detailsUrl = "#";
            let contentTitle = "Unknown Content";
            if (item.event) {
                detailsUrl = `/dashboard/influencer/events/${item.event_id || item.event?.id}`;
                contentTitle = item.event?.title;
            } else if (item.ad) {
                detailsUrl = `/dashboard/influencer/ads/${item.ad_id || item.ad?.id}`;
                contentTitle = item.ad?.title;
            } else if (item.contest) {
                detailsUrl = `/dashboard/influencer/contests/${item.contest_id || item.contest?.id}`;
                contentTitle = item.contest?.title;
            }

            return {
                id: item.id,
                title: contentTitle || "Unknown Event",
                detailsUrl,
                host: item.invited_by?.name || "Unknown User",
                status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending",
                statusTone: item.status || "pending",
                amount: item.ticket?.price || item.requested_amount || 0,
                currency: "$",
                requestedLabel: item.is_payment_requested ? "Requested" : "Ticket Price",
                avatar: item.invited_by?.avatar || `https://i.pravatar.cc/150?u=${item.id}`,
            };
        });
    }, [incomingInvitationsResponse]);

    const paymentRequestsData = useMemo(() => {
        const rawData = paymentRequestedResponse?.data || [];
        return rawData.map(item => {
            let detailsUrl = "#";
            let contentTitle = "Unknown Content";
            if (item.event) {
                detailsUrl = `/dashboard/influencer/events/${item.event_id || item.event?.id}`;
                contentTitle = item.event?.title;
            } else if (item.ad) {
                detailsUrl = `/dashboard/influencer/ads/${item.ad_id || item.ad?.id}`;
                contentTitle = item.ad?.title;
            } else if (item.contest) {
                detailsUrl = `/dashboard/influencer/contests/${item.contest_id || item.contest?.id}`;
                contentTitle = item.contest?.title;
            }

            const isProcessing = item.payment_status === "requested" || item.payment_status === "processing";
            return {
                id: item.id,
                title: contentTitle || "Unknown Event",
                detailsUrl,
                host: item.invited_user?.name || "Unknown User",
                avatar: item.invited_user?.avatar || `https://i.pravatar.cc/150?u=${item.id}`,
                paymentStatusTone: isProcessing ? "processing" : item.payment_status,
                paymentStatus: isProcessing ? "Pending Payment" : (item.payment_status ? item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1) : "Unknown"),
                date: item.updated_at || item.created_at,
                currency: "$",
                amount: parseFloat(item.requested_amount) || 0,
            };
        });
    }, [paymentRequestedResponse]);

    const collaborations = useMemo(() => {
        if (activeTab === "payment") {
            return paymentRequestsData;
        }

        if (activeTab === "sent") {
            return sentInvitationsData;
        }

        return incomingInvitationsData;
    }, [activeTab, sentInvitationsData, incomingInvitationsData, paymentRequestsData]);

    const handleRequestPayment = (item) => {
        setSelectedCollaboration(item);
    };

    const handleAccept = async (item) => {
        try {
            const formData = new FormData();
            formData.append("invitation_id", item.id);
            formData.append("status", "accepted");
            await actionInvitation(formData).unwrap();
            toast.success("Collaboration request accepted");
        } catch (error) {
            console.error("Error accepting request:", error);
            toast.error(error?.data?.message || "Failed to accept request");
        }
    };

    const handleReject = async (item) => {
        try {
            const formData = new FormData();
            formData.append("invitation_id", item.id);
            formData.append("status", "rejected");
            await actionInvitation(formData).unwrap();
            toast.info("Collaboration request rejected");
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error(error?.data?.message || "Failed to reject request");
        }
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

            {(activeTab === "sent" && isLoadingSent) || (activeTab === "incoming" && isLoadingIncoming) || (activeTab === "payment" && isLoadingPayment) ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
                    <p className="text-sm font-medium text-[#7a8582]">Loading {activeTab} requests...</p>
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