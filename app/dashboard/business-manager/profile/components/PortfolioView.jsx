"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PortfolioCard from "./PortfolioCard";
// import AddPortfolioModal from "../../portfolio/components/AddPortfolioModal";

const profilePortfolioItems = [
  {
    id: 1,
    title: "Bike Ads Portfolio",
    details:
      "Comprehensive bike ad campaigns showcasing freedom and lifestyle.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 2,
    title: "Mobile Ads Portfolio",
    details:
      "High engagement mobile ad campaigns built for native social feeds.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=520&fit=crop",
    likes: "22k",
    views: "21k",
  },
  {
    id: 3,
    title: "Event Branding",
    details:
      "Portfolio for live event branding, experiential activation, and design.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=520&fit=crop",
    likes: "20k",
    views: "19k",
  },
];

export default function PortfolioView() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Heading and Action Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-black">My Portfolio</h3>

        <div className="flex items-center gap-3 w-full sm:w-auto ml-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Portfolio</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid */}
      {profilePortfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {profilePortfolioItems.map(item => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={() => console.log("Open Details for ID:", item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray font-medium text-sm">
            No portfolio items found.
          </p>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {/* <AddPortfolioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitPortfolio={data => console.log("Portfolio added:", data)}
      /> */}
    </div>
  );
}
