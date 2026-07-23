import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TicketSVG, StarSVG } from './Svg';
import { formatDate } from '@/helper/formatDate';

export const TicketPrintTemplate = React.forwardRef(({ ticketData }, ref) => {
  if (!ticketData) return null;

  return (
    <div ref={ref} className="p-8 w-[1000px] mx-auto bg-white" style={{ fontFamily: "sans-serif" }}>
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-10 border-b-2 border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          {/* logo of the platform */}
          <img src="/logo.png" alt="Logo" width={180} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Official Event Ticket</h1>
          <p className="text-gray-500 mt-1">Please present this ticket at the entrance.</p>
        </div>
      </div>

      {/* Ticket Container - Side by Side layout */}
      <div className="flex items-center justify-center gap-6">
        
        {/* Front Design */}
        <div className="relative w-[450px] aspect-[564/241] overflow-hidden rounded-xl " style={{ containerType: 'inline-size' }}>
          <TicketSVG className="absolute inset-0 w-full h-full z-0" />
          
          <div className="absolute inset-0 z-10 px-[11%] py-[4%] flex">
            <div className="flex-1 border-2 border-white flex">
              <div className="flex-[3.5] flex flex-col items-center justify-center border-r-2 border-white/80 px-4 py-2">
                <div className="flex items-center gap-2">
                  <StarSVG className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold tracking-wider uppercase">Event Ticket</span>
                  <StarSVG className="w-4 h-4 text-white" />
                </div>
                
                <div className="relative w-32 h-8 my-2">
                  <img src="/images/ticket-texture.png" alt="TICKET" className="w-full h-full object-contain" />
                </div>
                
                <p className="text-white text-sm font-medium tracking-wide text-center px-4 leading-tight">
                  {ticketData.event_title}
                </p>
              </div>

              <div className="flex-[1] flex items-center justify-center">
                <p
                  className="text-white text-[16px] text-center font-bold tracking-[0.2em] select-none underline decoration-2"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {ticketData.ticket_code}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Design */}
        <div className="relative w-[450px] aspect-[564/241] overflow-hidden rounded-xl ">
          <TicketSVG className="absolute inset-0 w-full h-full z-0" />
          
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative p-3 bg-white rounded-lg shadow-sm">
              <QRCodeSVG 
                value={ticketData.ticket_code || "UNKNOWN"}
                size={110}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Ticket Details Summary */}
      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">Ticket Information</h2>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-sm text-gray-500 font-medium">Event Title</p>
            <p className="text-lg font-bold text-gray-900">{ticketData.event_title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ticket Code</p>
            <p className="text-lg font-bold text-gray-900">{ticketData.ticket_code}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 font-medium">Date & Time</p>
            <p className="text-base font-semibold text-gray-900">
              {ticketData.date ? formatDate(ticketData.date) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Location</p>
            <p className="text-base font-semibold text-gray-900">{ticketData.location || "N/A"}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 font-medium">Ticket Type</p>
            <p className="text-base font-semibold text-gray-900 capitalize">{ticketData.ticket_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Quantity</p>
            <p className="text-base font-semibold text-gray-900">{ticketData.quantity} </p>
          </div>
        </div>
      </div>
      
      {/* Footer Instructions */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Please print this page or have it ready on your mobile device.</p>
        <p>Purchased at: {ticketData.purchased_at ? formatDate(ticketData.purchased_at) : "N/A"}</p>
      </div>
    </div>
  );
});

TicketPrintTemplate.displayName = 'TicketPrintTemplate';
