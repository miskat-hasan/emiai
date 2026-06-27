"use client";

import React from "react";
import { Ticket } from "@/components/common/Ticket";

// ── Mock data ───────────────────────────────────────────────────────────────
const MY_TICKETS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "Digital Marketing Forum 2025",
  ticketNumber: "1234567890",
  qrCode: "/images/demo-qrcode.png",
}));

export default function TicketsPage({ role }) {
  const tickets = MY_TICKETS;

  return (
    <div className="space-y-6 font-dm-sans">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Tickets</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Tickets</span>
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Tickets</h2>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray">
          <p className="text-base font-medium">No tickets found</p>
          <p className="text-sm mt-1 text-gray/70">
            Tickets for events you join will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <Ticket
              key={ticket.id}
              title={ticket.title}
              ticketNumber={ticket.ticketNumber}
              qrCode={ticket.qrCode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
