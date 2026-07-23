'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useGetTicketDetailsQuery } from '@/redux/api/services/eventApi';
import { toast } from 'react-toastify';
import { TicketPrintTemplate } from './TicketPrintTemplate';
import { X, Download, Loader2 } from 'lucide-react';

export const PrintTicketManager = ({ ticketCode, onReset }) => {
  const printRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  console.log("[PrintTicketManager] Mounted with ticketCode:", ticketCode);

  // Fetch ticket details
  const { data: response, isLoading, isFetching, isError, error, isSuccess } = useGetTicketDetailsQuery(ticketCode, {
    skip: !ticketCode,
  });

  console.log("[PrintTicketManager] Query state:", { isLoading, isFetching, isError, isSuccess, data: response, error });

  const ticketData = response?.data;

  useEffect(() => {
    if (isError) {
      console.error("[PrintTicketManager] API Error:", error);
      toast.error("Failed to load ticket details.");
    }
  }, [isError, error]);

  const handleDownload = async () => {
    if (!printRef.current) {
      console.error("[PrintTicketManager] printRef.current is null");
      toast.error("Could not generate PDF. Please try again.");
      return;
    }

    setIsGenerating(true);
    console.log("[PrintTicketManager] Starting PDF generation...");

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      console.log("[PrintTicketManager] Canvas created:", canvas.width, "x", canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Ticket_${ticketData?.ticket_code || ticketCode}.pdf`);

      console.log("[PrintTicketManager] PDF saved!");
      toast.success("Ticket PDF downloaded!");
    } catch (err) {
      console.error("[PrintTicketManager] PDF generation failed:", err);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onReset(); }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="bg-white px-8 py-5 rounded-2xl shadow-xl flex items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="font-semibold text-gray-800 text-base">Loading ticket details...</span>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="bg-white px-8 py-6 rounded-2xl shadow-xl max-w-md text-center">
          <p className="text-red-500 font-semibold text-lg mb-2">Failed to load ticket</p>
          <p className="text-gray-500 text-sm mb-4">
            Could not fetch details for ticket code: <strong>{ticketCode}</strong>
          </p>
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Preview modal*/}
      {!isLoading && ticketData && (
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-[1100px] w-[95vw] max-h-[90vh] overflow-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg font-bold text-gray-900">Ticket Preview</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </button>
              <button
                onClick={onReset}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Ticket preview content */}
          <div className="p-6 flex justify-center overflow-x-auto">
            <TicketPrintTemplate ref={printRef} ticketData={ticketData} />
          </div>
        </div>
      )}
    </div>
  );
};
