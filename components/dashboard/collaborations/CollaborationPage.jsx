// components/dashboard/collaborations/CollaborationPage.jsx
"use client";

import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import {
  useGetCollaboratorsQuery,
  useGetMysendInvitationsQuery,
  useGetPaymentRequestedInvitationsQuery,
  useActionInvitationMutation,
  useApprovePaymentMutation,
} from "@/redux/api/services/collaboratorsApi";
import PaymentRequestCard from "@/app/dashboard/influencer/components/PaymentRequestCard";
import CollaborationCard from "./CollaborationCard";
import CollaborationPaymentModal from "./CollaborationPaymentModal";

const collaborationTabs = [
  { label: "Incoming Requests", value: "incoming" },
  { label: "Sent Requests", value: "sent" },
  { label: "Payment Requests", value: "payment" },
];

// One event can carry multiple collaborators, each with their own pivot.status —
// so this produces one card PER (event, collaborator) pair, not one per event.
function mapEventToCards(item, variant) {
  const collaborators = item.event_collaborators?.length
    ? item.event_collaborators
    : [null];

  return collaborators.map(collaboratorEntry => {
    const status = collaboratorEntry?.pivot?.status || "invited";

    return {
      id: item.id, // event id — used for the handle/{event_id, status} payload
      collaboratorId: collaboratorEntry?.id,
      cardKey: `${item.id}-${collaboratorEntry?.id ?? "self"}`,
      title: item.title || "Untitled Event",
      detailsUrl: `events/${item.id}`,
      host:
        variant === "incoming"
          ? item.creator?.name || "Unknown User"
          : collaboratorEntry?.name || "Unknown User",
      avatar:
        variant === "incoming"
          ? item.creator?.avatar
          : collaboratorEntry?.avatar,
      status: status.charAt(0).toUpperCase() + status.slice(1),
      statusTone: status,
      date: item.date,
      location: item.location,
    };
  });
}

// PROVISIONAL: no confirmed sample response for this endpoint yet.
function mapPaymentItem(item) {
  const paymentStatus = item.payment_status || item.status || "pending";
  const isPending =
    paymentStatus === "requested" ||
    paymentStatus === "processing" ||
    paymentStatus === "pending";

  return {
    id: item.id,
    title: item.event?.title || item.title || "Untitled Event",
    host:
      item.invited_by?.name ||
      item.event?.creator?.name ||
      item.host ||
      "Unknown User",
    avatar: item.invited_by?.avatar || item.event?.creator?.avatar,
    paymentStatusTone: isPending ? "pending" : paymentStatus,
    paymentStatus:
      paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1),
    currency: "$",
    amount: parseFloat(item.requested_amount ?? item.amount ?? 0),
  };
}

export default function CollaborationsPage() {
  const [activeTab, setActiveTab] = useState("incoming");
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [actioningKey, setActioningKey] = useState(null);

  const { data: incomingResponse, isLoading: isLoadingIncoming } =
    useGetCollaboratorsQuery();
  const { data: sentResponse, isLoading: isLoadingSent } =
    useGetMysendInvitationsQuery();
  const { data: paymentResponse, isLoading: isLoadingPayment } =
    useGetPaymentRequestedInvitationsQuery();
  const [actionInvitation] = useActionInvitationMutation();
  const [approvePayment] = useApprovePaymentMutation();

  const incomingData = useMemo(
    () =>
      (incomingResponse?.data || []).flatMap(item =>
        mapEventToCards(item, "incoming"),
      ),
    [incomingResponse],
  );

  const sentData = useMemo(
    () =>
      (sentResponse?.data || []).flatMap(item => mapEventToCards(item, "sent")),
    [sentResponse],
  );

  const paymentData = useMemo(
    () => (paymentResponse?.data || []).map(mapPaymentItem),
    [paymentResponse],
  );

  const collaborations = useMemo(() => {
    if (activeTab === "payment") return paymentData;
    if (activeTab === "sent") return sentData;
    return incomingData;
  }, [activeTab, sentData, incomingData, paymentData]);

  const handleRequestPayment = item => setSelectedCollaboration(item);

  const handleAccept = async item => {
    setActioningKey(item.cardKey);
    try {
      await actionInvitation({
        event_id: item.id,
        status: "accepted",
      }).unwrap();
      toast.success("Collaboration request accepted");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept request");
    } finally {
      setActioningKey(null);
    }
  };

  const handleReject = async item => {
    setActioningKey(item.cardKey);
    try {
      await actionInvitation({
        event_id: item.id,
        status: "rejected",
      }).unwrap();
      toast.info("Collaboration request rejected");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject request");
    } finally {
      setActioningKey(null);
    }
  };

  const handleApprovePayment = async item => {
    setActioningKey(item.id);
    try {
      await approvePayment({
        invitation_id: item.id,
        action: "approved",
      }).unwrap();
      toast.success("Payment approved");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve payment");
    } finally {
      setActioningKey(null);
    }
  };

  const handleRejectPayment = async item => {
    setActioningKey(item.id);
    try {
      await approvePayment({
        invitation_id: item.id,
        action: "rejected",
      }).unwrap();
      toast.info("Payment rejected");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject payment");
    } finally {
      setActioningKey(null);
    }
  };

  const isLoadingActiveTab =
    (activeTab === "sent" && isLoadingSent) ||
    (activeTab === "incoming" && isLoadingIncoming) ||
    (activeTab === "payment" && isLoadingPayment);

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center gap-3">
        {collaborationTabs.map(tab => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-[#f6ded5] text-[#202626] hover:bg-primary hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoadingActiveTab ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-[#7a8582]">
            Loading {activeTab} requests...
          </p>
        </div>
      ) : collaborations.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {collaborations.map(item =>
            activeTab === "payment" ? (
              <PaymentRequestCard
                key={item.id}
                item={item}
                onAccept={handleApprovePayment}
                onReject={handleRejectPayment}
                isActioning={actioningKey === item.id}
              />
            ) : (
              <CollaborationCard
                key={item.cardKey}
                item={item}
                variant={activeTab}
                onAccept={handleAccept}
                onReject={handleReject}
                onRequestPayment={handleRequestPayment}
                isActioning={actioningKey === item.cardKey}
              />
            ),
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
