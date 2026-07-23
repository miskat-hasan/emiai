// components/dashboard/peer-invitations/PeerInvitations.jsx
"use client";
import { getImageUrl } from "@/helper/getImageUrl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  useGetMyInvitationsQuery,
  useGetMySentInvitationsQuery,
  useActionInvitationMutation,
  useRequestInvitationPaymentMutation,
  useGetPaymentRequestedInvitationsQuery,
  useApproveInvitationPaymentMutation,
} from "@/redux/api/services/peerInvitationsApi";
import SentInvitationCard from "./SentInvitationCard";
import PaymentRequestCard from "./PaymentRequestCard";
import { useSelector } from "react-redux";

export const invitationTabs = [
  { label: "Incoming Requests", value: "incoming" },
  { label: "Sent Requests", value: "sent" },
  { label: "Payment Requests", value: "payment" },
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = date =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function mapIncoming(item) {
  return {
    id: item.id,
    title: item.event?.title || "Untitled Event",
    status: item.status
      ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
      : "Pending",
    statusTone: item.status || "pending",
    date: formatDate(item.event?.date),
    location: item.event?.location || "—",
    from: {
      name: item.invited_by?.name || "Unknown User",
      avatar: item.invited_by?.avatar,
    },
    message: item.message,
    isPaymentRequested: Boolean(item.is_payment_requested),
    paymentStatus: item.payment_status,
    requestedAmount: parseFloat(item.requested_amount) || 0,
  };
}

function mapSent(item) {
  return {
    id: item.id,
    title: item.event?.title || "Untitled Event",
    status: item.status
      ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
      : "Pending",
    statusTone: item.status || "pending",
    date: formatDate(item.event?.date),
    location: item.event?.location || "—",
    to: {
      name: item.invited_user?.name || "Unknown User",
      avatar: item.invited_user?.avatar,
    },
    message: item.message,
    isPaymentRequested: Boolean(item.is_payment_requested),
    paymentStatus: item.payment_status,
    requestedAmount: parseFloat(item.requested_amount) || 0,
  };
}

function mapPaymentRequest(item) {
  return {
    id: item.id,
    title: item.event?.title || "Untitled Event",
    date: formatDate(item.event?.date),
    location: item.event?.location || "—",
    from: {
      name: item.invited_user?.name || "Unknown User",
      avatar: item.invited_user?.avatar,
    },
    requestedAmount: parseFloat(item.requested_amount) || 0,
  };
}

const IncomingInvitationCard = ({
  invitation,
  onAccept,
  onReject,
  onRequestPayment,
  isActioning,
}) => {
  const isPending = invitation.statusTone === "pending";
  const paymentPending = invitation.paymentStatus === "requested";
  // Assumption: while a payment ask is unresolved, hold off on accept/reject/re-request.
  const showActions = isPending && !paymentPending;

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
              <Image
                src={getImageUrl(invitation.from.avatar)}
                alt={invitation.from.name}
                className="h-full w-full object-cover"
                height={36}
                width={36}
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

      {paymentPending ? (
        <div className="rounded-xl bg-[#eef2ff] px-4 py-3 text-center text-xs font-semibold text-[#4f63f6]">
          Payment request of ${invitation.requestedAmount} sent — waiting on
          host
        </div>
      ) : (
        <>
          {isPending && (
            <div className="mb-4 grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={isActioning}
                onClick={() => onReject(invitation)}
                className="h-10 rounded-xl border border-secondary bg-white text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={isActioning}
                onClick={() => onAccept(invitation)}
                className="h-10 rounded-xl bg-[#f3f3f3] text-xs font-semibold text-secondary transition-all duration-300 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Accept
              </button>
            </div>
          )}

          {isPending && (
            <button
              type="button"
              onClick={() => onRequestPayment(invitation)}
              className="h-11 w-full rounded-xl bg-[linear-gradient(90deg,_#F57802_0%,_#EB4A35_100%)] text-xs font-bold text-white transition-all duration-300 hover:opacity-90 cursor-pointer"
            >
              Request Payment
            </button>
          )}
        </>
      )}
    </div>
  );
};

const RequestPaymentModal = ({ open, invitation, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { amount: "" },
  });
  const [requestPayment, { isLoading: isSubmitting }] =
    useRequestInvitationPaymentMutation();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async data => {
    try {
      await requestPayment({
        invitation_id: invitation?.id,
        amount: Number(data.amount),
      }).unwrap();
      toast.success("Payment request sent to host");
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send payment request");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-[530px] rounded-[22px] bg-white px-5 py-8 shadow-2xl sm:px-10 sm:py-10">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-[#60706c] transition-all duration-300 hover:bg-secondary hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#2f3433]">
            Request payment
          </h2>
          <p className="mx-auto max-w-[360px] text-lg font-medium leading-[1.35] text-[#2f3a38]">
            Ask the host to cover your appearance fee before accepting
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
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
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
            />
            {errors.amount && (
              <p className="mt-2 text-sm font-medium text-secondary">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={handleClose}
              className="h-[54px] min-w-[130px] rounded-xl text-lg font-semibold text-[#004f49] transition-all duration-300 hover:bg-[#f3f3f3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[54px] min-w-[175px] rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 text-lg font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PeerInvitations() {
  const user = useSelector(state => state.auth?.user);
  
  const [activeTab, setActiveTab] = useState("incoming");
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const { data: incomingResponse, isLoading: isLoadingIncoming } =
    useGetMyInvitationsQuery();
  const { data: sentResponse, isLoading: isLoadingSent } =
    useGetMySentInvitationsQuery();
  const { data: paymentResponse, isLoading: isLoadingPayment } =
    useGetPaymentRequestedInvitationsQuery();

  const [actionInvitation] = useActionInvitationMutation();
  const [approveInvitationPayment] = useApproveInvitationPaymentMutation();

  const incomingData = useMemo(
    () => (incomingResponse?.data || []).map(mapIncoming),
    [incomingResponse],
  );
  const sentData = useMemo(
    () => (sentResponse?.data || []).map(mapSent),
    [sentResponse],
  );
  const paymentData = useMemo(
    () => (paymentResponse?.data || []).map(mapPaymentRequest),
    [paymentResponse],
  );

  const filteredInvitations = useMemo(() => {
    if (activeTab === "sent") return sentData;
    if (activeTab === "payment") return paymentData;
    return incomingData;
  }, [activeTab, incomingData, sentData, paymentData]);

  const handleAccept = async invitation => {
    setActioningId(invitation.id);
    try {
      await actionInvitation({
        invitation_id: invitation.id,
        status: "accepted",
      }).unwrap();
      toast.success("Invitation accepted");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept invitation");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async invitation => {
    setActioningId(invitation.id);
    try {
      await actionInvitation({
        invitation_id: invitation.id,
        status: "rejected",
      }).unwrap();
      toast.info("Invitation rejected");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject invitation");
    } finally {
      setActioningId(null);
    }
  };

  const handleApprovePayment = async item => {
    setActioningId(item.id);
    try {
      await approveInvitationPayment({
        invitation_id: item.id,
        action: "approved",
      }).unwrap();
      toast.success("Payment request approved");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve payment");
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectPayment = async item => {
    setActioningId(item.id);
    try {
      await approveInvitationPayment({
        invitation_id: item.id,
        action: "rejected",
      }).unwrap();
      toast.info("Payment request rejected");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject payment");
    } finally {
      setActioningId(null);
    }
  };

  const isLoadingActiveTab =
    (activeTab === "incoming" && isLoadingIncoming) ||
    (activeTab === "sent" && isLoadingSent) ||
    (activeTab === "payment" && isLoadingPayment);

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center gap-3">
        {invitationTabs.map(tab => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-xl px-5 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-[#f6ded5] text-[#533c36] hover:bg-primary hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoadingActiveTab ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-[#7a8582]">
            Loading {activeTab} requests...
          </p>
        </div>
      ) : filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredInvitations.map(invitation => {
            if (activeTab === "sent") {
              return (
                <SentInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onApprovePayment={handleApprovePayment}
                  onRejectPayment={handleRejectPayment}
                  isActioning={actioningId === invitation.id}
                />
              );
            }
            if (activeTab === "payment") {
              return (
                <PaymentRequestCard
                  key={invitation.id}
                  item={invitation}
                  onApprove={handleApprovePayment}
                  onReject={handleRejectPayment}
                  isActioning={actioningId === invitation.id}
                />
              );
            }
            return (
              <IncomingInvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={handleAccept}
                onReject={handleReject}
                onRequestPayment={setSelectedInvitation}
                isActioning={actioningId === invitation.id}
              />
            );
          })}
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
