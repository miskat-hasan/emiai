"use client";
import StatusBadge from "@/components/common/StatusBadge";
import {
  AcceptDelivaryPage,
  ConfirmationModal,
  DeliveryModal,
} from "@/components/dashboard/deals";
import { formatDate } from "@/helper/formatDate";
import { getImageUrl } from "@/helper/getImageUrl";
import {
  useGetDealDetailsQuery,
  useSubmitDeliveryMutation,
  useUpdateDealStatusMutation,
} from "@/redux/api/services/dealApi";
import { Flag, Headphones } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const MOCK_DEAL = {
  id: 1,
  status: "active",
  person: "Lina Armand",
  avatar: null,
  date: "Feb 24, 2026",
  description:
    "Pellentesque suscipit fringilla libero eu ullamcorper. Cras risus eros, faucibus sit amet augue id, tempus pellentesque eros. In imperdiet tristique tincidunt. Integer lobortis lorem lorem,",
  netPayout: "SAR 5400",
  sponsor: {
    logo: null,
    name: "Sponsor by Robiul Tour",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealDetailPage({ role }) {
  const router = useRouter();
  const { id } = useParams();
  const { data: dealDetails, isLoading } = useGetDealDetailsQuery(id);
  const [updateDealStatus, { isLoading: isUpdating }] =
    useUpdateDealStatusMutation();
  const [submitDelivery, { isLoading: isSubmitting }] =
    useSubmitDeliveryMutation();
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isConfirmDeliveryModalOpen, setIsConfirmDeliveryModalOpen] =
    useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const user = useSelector((state) => state.auth?.user);
  console.log(dealDetails);
  const deal = MOCK_DEAL;

  const isOwner = user?.id === dealDetails?.data?.requested_by?.id;

  if (isOwner && (dealDetails?.data?.status === "delivered" || dealDetails?.data?.status === "completed")) {
    return <AcceptDelivaryPage role={role} dealDetails={dealDetails} />;
  }

  return (
    <div className="space-y-6   ">
      {/* ── Breadcrumb ── */}
      <div>
        <h1 className="text-2xl font-bold text-black">Deals</h1>
        <p className="text-sm text-gray mt-0.5">
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/${role}`)}
          >
            Dashboard
          </span>
          {" / "}
          <span
            className="text-primary font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/${role}/deals`)}
          >
            Deals
          </span>
          {" / "}
          <span>Details</span>
        </p>
      </div>

      {/* ── Deal detail card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-black">Status</span>
          <div className="flex items-center gap-3">
            {/* Support icon */}
            <button
              className="flex flex-col items-center gap-0.5 text-gray hover:text-primary transition-colors"
              title="Contact Support"
            >
              <Headphones size={18} />
              <span className="text-[10px] leading-none">Support</span>
            </button>

            {/* Flag icon */}
            <button
              className="text-gray hover:text-red-500 transition-colors"
              title="Report"
            >
              <Flag size={18} />
            </button>
            <StatusBadge status={dealDetails?.data?.status} />
          </div>
        </div>

        {/* Person row */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/60 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-primary to-secondary">
              {deal?.partner?.avatar ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${dealDetails?.data?.partner?.avatar}`}
                  alt={dealDetails?.data?.partner?.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                  {dealDetails?.data?.partner?.name?.at(0)}
                </span>
              )}
            </div>
            <span className="text-base font-semibold text-black">
              {dealDetails?.data?.partner?.name}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray">Date</p>
            <p className="text-sm font-semibold text-black">
              {formatDate(dealDetails?.data?.created_at)}
            </p>
          </div>
        </div>

        {/* Description + payout */}
        <div className="flex items-start justify-between gap-8 px-6 py-5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black mb-2">
              Offer Description
            </p>
            <p className="text-sm text-gray leading-relaxed">
              {dealDetails?.data?.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-black">Net Payout</p>
            <p className="text-sm font-bold text-black mt-0.5">
              {dealDetails?.data?.amount}
            </p>
          </div>
        </div>

        {/* <div className="flex items-center justify-between px-6 pb-6">
          <button
            onClick={() => console.log("reject", deal.id)}
            className="text-sm font-semibold text-primary hover:underline transition-colors"
          >
            Reject
          </button>
          <button
        {/* Actions */}
        {!isOwner && dealDetails?.data?.status === "pending" && (
          <div className="flex items-center justify-between px-6 pb-6">
            <button
              onClick={() => console.log("reject", deal.id)}
              className="text-sm font-semibold text-primary hover:underline transition-colors hover:cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={() => setIsAcceptModalOpen(true)}
              className="px-8 py-2.5 rounded-xl bg-linear-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 hover:cursor-pointer"
            >
              Accept
            </button>
          </div>
        )}
        {/* if it is in active status */}
        {isOwner && dealDetails?.data?.status === "delivered" && (
          <div className="flex items-center justify-between px-6 pb-6">
            <button
              onClick={() => console.log("reject", deal.id)}
              className="text-sm font-semibold text-primary hover:underline transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => console.log("accept", deal.id)}
              className="px-8 py-2.5 rounded-xl bg-linear-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 hover:cursor-pointer"
            >
              Mark as Completed
            </button>
          </div>
        )}
        
        {!isOwner && dealDetails?.data?.status === "rejected" && (
          <div className="flex items-center justify-between px-6 pb-6">
            <button
              onClick={() => console.log("reject", deal.id)}
              className="text-sm font-semibold text-primary hover:underline transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsDeliveryModalOpen(true)}
              className="px-8 py-2.5 rounded-xl bg-linear-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 hover:cursor-pointer"
            >
              Deliver Again
            </button>
          </div>
        )}

        {/* jodi status active hoy and deal worker hoy tahole delivary korar button dekhate hobe */}
        {!isOwner && dealDetails?.data?.status === "active" && (
          <div className="flex items-center justify-between px-6 pb-6">
            <button
              onClick={() => console.log("reject", deal.id)}
              className="text-sm font-semibold text-primary hover:underline transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsDeliveryModalOpen(true)}
              className="px-8 py-2.5 rounded-xl bg-linear-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 hover:cursor-pointer"
            >
              Mark as Delivered
            </button>
          </div>
        )}

        {/* ── Sponsor section ── */}
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100"
          style={{
            background: "var(--stat-sublabel-bg, rgba(245,120,2,0.06))",
          }}
        >
          {/* Sponsor logo */}
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-gray-100 flex items-center justify-center">
            {deal.sponsor.logo ? (
              <Image
                src={getImageUrl(deal.sponsor.logo)}
                alt={deal.sponsor.name}
                width={56}
                height={56}
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
            )}
          </div>
          <p className="text-base font-semibold text-black">
            {deal.sponsor.name}
          </p>
        </div>
      </div>

      <ConfirmationModal
        open={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        title="Accept Deal"
        message="Are you sure you want to accept this deal?"
        confirmText="Yes"
        cancelText="No"
        isLoading={isUpdating}
        onConfirm={async () => {
          try {
            await updateDealStatus({ id: deal.id, status: "active" }).unwrap();
            setIsAcceptModalOpen(false);
            toast.success("Deal accepted successfully!");
          } catch (error) {
            console.error("Failed to accept deal", error);
            toast.error(
              error?.data?.message || error?.message || "Failed to accept deal",
            );
          }
        }}
      />

      <DeliveryModal
        open={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSubmit={(data) => {
          setDeliveryData(data);
          setIsDeliveryModalOpen(false);
          setIsConfirmDeliveryModalOpen(true);
        }}
      />

      <ConfirmationModal
        open={isConfirmDeliveryModalOpen}
        onClose={() => setIsConfirmDeliveryModalOpen(false)}
        title="Delivery Confirmation"
        message="Are you sure you want to delivered the deal?"
        confirmText="Yes"
        cancelText="No"
        isLoading={isUpdating || isSubmitting}
        onConfirm={async () => {
          try {
            await submitDelivery({
              deal_id: deal.id,
              delivery_message: deliveryData?.message,
              file: deliveryData?.file,
            }).unwrap();

            await updateDealStatus({
              id: deal.id,
              status: "delivered",
            }).unwrap();

            setIsConfirmDeliveryModalOpen(false);
            setDeliveryData(null);
            toast.success("Deal delivered successfully!");
          } catch (error) {
            console.error("Failed to deliver deal", error);
            toast.error(
              error?.data?.message ||
                error?.message ||
                "Failed to deliver deal",
            );
          }
        }}
      />
    </div>
  );
}
