"use client";

import { useRegisterTicketMutation } from "@/redux/api/services/eventApi";
import { ChevronDown, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

export default function BuyTicketModal({ open, onClose, event, onSuccess }) {
  const { register, handleSubmit, reset, control } = useForm();
  const [registerTicket, { isLoading }] = useRegisterTicketMutation();

  const selectedTicketId = useWatch({
    control,
    name: "ticketType",
    defaultValue: "",
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      reset();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, reset]);

  if (!open) return null;

  const tickets = event?.tickets || [];

  const selectedTicket = tickets.find(
    (t) => String(t.id) === String(selectedTicketId),
  );
  const entryFee = selectedTicket
    ? selectedTicket.price || 0
    : event?.entry_fee || 0;

  const onSubmit = async (data) => {
    const fd = new FormData();
    fd.append(
      "event_id",
      selectedTicket?.event_id || event?.event_id || event?.id,
    );
    fd.append("ticket_id", data.ticketType);

    try {
      await registerTicket(fd).unwrap();
      toast.success("Ticket bought successfully!");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to buy ticket.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full border-2 border-black text-black hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 px-4">
          <h2 className="text-[20px] font-medium text-black">
            Buy Ticket To Join
          </h2>
          <p className="text-[#63716E] text-[14px] mt-3 leading-relaxed">
            If you want to join the event you need to pay
          </p>
          <p className="text-black text-lg font-medium mt-1">
            {selectedTicketId
              ? `Entry fee: $${selectedTicket?.price}`
              : "Entry fee: Please select a ticket first."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-5"
        >
          {/* Ticket Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[#63716E]">
              Ticket Type
            </label>
            <div className="relative">
              <select
                defaultValue=""
                {...register("ticketType", { required: true })}
                className="w-full rounded-xl bg-[#F8F9FA] border border-transparent px-4 py-3 text-[12px] text-[#203430] outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-[#63716E]">
                  Select a ticket
                </option>
                {tickets.map((ticket, idx) => (
                  <option key={ticket.id || idx} value={ticket.id}>
                    {ticket.ticket_type ||
                      ticket.type ||
                      ticket.name ||
                      "Ticket"}{" "}
                    - ${ticket.price || 0}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#203430]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-[220px] py-3 rounded-full bg-primary text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm cursor-pointer"
            >
              {isLoading ? "Processing..." : "Buy Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
