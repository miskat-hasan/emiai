"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import PortfolioCard from "./components/PortfolioCard";
import AddPortfolioModal from "./components/AddPortfolioModal";
export const portfolioTabs = [
  {
    label: "My Portfolio",
    value: "my_portfolio",
  },
  {
    label: "Agency Portfolio",
    value: "agency_portfolio",
  },
];

export const profilePortfolioItems = [
  {
    id: 1,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 2,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 3,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 4,
    type: "my_portfolio",
    title: "Mobile Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 5,
    type: "my_portfolio",
    title: "Mobile Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 6,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 7,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 8,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Hello this is about my portfolio project",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 101,
    type: "agency_portfolio",
    title: "Agency Branding Portfolio",
    details: "Agency campaign portfolio showcase",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&h=520&fit=crop",
    likes: "18k",
    views: "21k",
  },
  {
    id: 102,
    type: "agency_portfolio",
    title: "Creative Ads Portfolio",
    details: "Creative advertising portfolio showcase",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&h=520&fit=crop",
    likes: "20k",
    views: "25k",
  },
];



export default function PortfolioPage() {
    const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my_portfolio");

  const filteredPortfolioItems = useMemo(() => {
    return profilePortfolioItems.filter((item) => item.type === activeTab);
  }, [activeTab]);

  const handleAddNewPortfolio = () => {
    toast.info("Add new portfolio form will be connected later");
  };



  return (
    <section className="w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {portfolioTabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`h-[34px] rounded-[10px] px-5 text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-[#f6ded5] text-[#202626] hover:bg-primary hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-[34px] rounded-[10px] bg-gradient-to-r from-primary to-secondary px-5 text-xs font-semibold text-white transition-all duration-300 hover:opacity-90"
        >
          Add New Portfolio
        </button>
      </div>

      {filteredPortfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredPortfolioItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <div>
            <h3 className="mb-2 text-lg font-bold text-[#252525]">
              No portfolio found
            </h3>

            <p className="text-sm font-medium text-[#7a8582]">
              Your portfolio items will appear here.
            </p>
          </div>
        </div>
      )}

      <AddPortfolioModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSubmitPortfolio={(data) => console.log("Portfolio added:", data)}
/>
    </section>
  );
}