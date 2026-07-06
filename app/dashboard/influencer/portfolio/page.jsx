"use client";

import { useMemo, useState } from "react";
import PortfolioCard from "./components/PortfolioCard";
import AddPortfolioModal from "./components/AddPortfolioModal";
import PortfolioDetailsModal from "./components/PortfolioDetailsModal";
import AgencyPortfolioDetailsModal from "./components/AgencyPortfolioDetailsModal";

// Tabs
export const portfolioTabs = [
  { label: "My Portfolio", value: "my_portfolio" },
  { label: "Agency Portfolio", value: "agency_portfolio" },
];

// ---------------- Personal Portfolio ----------------
// Personal Portfolio
export const profilePortfolioItems = [
  {
    id: 1,
    type: "my_portfolio",
    title: "Bike Ads Portfolio",
    details: "Comprehensive bike ad campaigns",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&h=520&fit=crop",
    likes: "23k",
    views: "23k",
  },
  {
    id: 2,
    type: "my_portfolio",
    title: "Mobile Ads Portfolio",
    details: "High engagement mobile ad campaigns",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=520&fit=crop",
    likes: "22k",
    views: "21k",
  },
  {
    id: 3,
    type: "my_portfolio",
    title: "Event Branding",
    details: "Portfolio for live event branding",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=520&fit=crop",
    likes: "20k",
    views: "19k",
  },
  {
    id: 4,
    type: "my_portfolio",
    title: "App Launch Campaign",
    details: "Creative launch visuals",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&h=520&fit=crop",
    likes: "19k",
    views: "18k",
  },
  {
    id: 5,
    type: "my_portfolio",
    title: "Email Marketing Portfolio",
    details: "High engagement email campaigns",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&h=520&fit=crop",
    likes: "21k",
    views: "20k",
  },
  {
    id: 6,
    type: "my_portfolio",
    title: "Social Media Campaigns",
    details: "Facebook and Instagram campaigns",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&h=520&fit=crop",
    likes: "20k",
    views: "19k",
  },
  {
    id: 7,
    type: "my_portfolio",
    title: "Event Photography Ads",
    details: "Photography-based promotion campaigns",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&h=520&fit=crop",
    likes: "18k",
    views: "17k",
  },
  {
    id: 8,
    type: "my_portfolio",
    title: "Product Launch Graphics",
    details: "High-end product launch visuals",
    image:
      "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?w=700&h=520&fit=crop",
    likes: "22k",
    views: "21k",
  },
  {
    id: 9,
    type: "my_portfolio",
    title: "Creative Ads Portfolio",
    details: "Multiple creative ad campaigns",
    image:
      "https://images.unsplash.com/photo-1522202176989-abcdef123456?w=700&h=520&fit=crop",
    likes: "23k",
    views: "22k",
  },
  {
    id: 10,
    type: "my_portfolio",
    title: "Influencer Marketing",
    details: "Portfolio showing influencer collaborations",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=520&fit=crop",
    likes: "21k",
    views: "20k",
  },
];

export const portfolioDetailsData = [
  {
    id: 1,
    title: "Bike Ads Portfolio",
    likes: "23k",
    views: "23k",
    publishedAt: "Nov 6th 2025",
    items: [
      {
        title: "Bike Ad Campaign 1",
        description: "Dynamic motorcycle ads showcasing freedom and adventure.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
      },
      {
        title: "Bike Ad Campaign 2",
        description: "Creative approach to biker lifestyle marketing.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=520&fit=crop",
      },
      {
        title: "Bike Ad Campaign 3",
        description: "Targeted ad visuals for motorbike enthusiasts.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=520&fit=crop",
      },
    ],
    bottomGallery: [
      {
        name: "Charli Levin",
        role: "Influencer",
        images: [
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Mobile Ads Portfolio",
    likes: "22k",
    views: "21k",
    publishedAt: "Oct 15th 2025",
    items: [
      {
        title: "Mobile App Launch",
        description: "Mobile campaign with vibrant UI/UX visuals",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
      },
      {
        title: "Email Marketing Campaign",
        description: "High engagement email marketing visuals",
        image:
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&h=520&fit=crop",
      },
      {
        title: "Mobile App Ads 3",
        description: "Additional mobile ad campaign with animations",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&h=520&fit=crop",
      },
    ],
    bottomGallery: [
      {
        name: "Alex Morgan",
        role: "Marketing Specialist",
        images: [
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
        ],
      },
    ],
  },
];

export const agencyPortfolioData = [
  {
    id: 101,
    type: "agency_portfolio",
    title: "Agency Branding Portfolio",
    details: "Agency campaign portfolio showcase",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
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

export const agencyPortfolioDetailsData = [
  {
    id: 101,
    title: "Agency Branding Portfolio",
    likes: "18k",
    views: "21k",
    publishedAt: "Nov 10th 2025",
    items: [
      {
        title: "Corporate Branding",
        description: "Showcasing corporate branding campaigns for clients",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
      },
      {
        title: "Product Ads Campaign",
        description: "Creative product advertising for multiple brands",
        image:
          "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&h=520&fit=crop",
      },
      {
        title: "Video Ads",
        description: "Short-form video campaigns for online marketing",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&h=520&fit=crop",
      },
    ],
    bottomGallery: [
      {
        name: "Agency Team",
        role: "Marketing Agency",
        images: [
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
        ],
      },
    ],
  },
  {
    id: 102,
    title: "Creative Ads Portfolio",
    likes: "20k",
    views: "25k",
    publishedAt: "Dec 5th 2025",
    items: [
      {
        title: "Video Marketing",
        description: "Portfolio of video campaigns for social media",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
      },
      {
        title: "Social Media Campaigns",
        description: "Creative social media campaign designs",
        image:
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&h=520&fit=crop",
      },
      {
        title: "Product Launch Campaign",
        description: "Creative product launch campaign visuals",
        image:
          "https://images.unsplash.com/photo-1522202176989-abcdef123456?w=700&h=520&fit=crop",
      },
    ],
    bottomGallery: [
      {
        name: "Creative Team",
        role: "Agency Team",
        images: [
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=200&fit=crop",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
        ],
      },
    ],
  },
];

// Portfolio Page
export default function PortfolioPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my_portfolio");

  // Modals state
  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [selectedPersonalId, setSelectedPersonalId] = useState(null);

  const [agencyModalOpen, setAgencyModalOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);

  // Filter cards based on tab
  const filteredPortfolioItems = useMemo(() => {
    return activeTab === "my_portfolio"
      ? profilePortfolioItems
      : agencyPortfolioData;
  }, [activeTab]);

  // Open modals
  const openPersonalModal = (id) => {
    setSelectedPersonalId(id);
    setPersonalModalOpen(true);
  };

  const openAgencyModal = (id) => {
    setSelectedAgencyId(id);
    setAgencyModalOpen(true);
  };

  return (
    <section className="w-full">
      {/* Tabs */}
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

        {/* Add Portfolio */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-[34px] rounded-[10px] bg-gradient-to-r from-primary to-secondary px-5 text-xs font-semibold text-white transition-all duration-300 hover:opacity-90"
        >
          Add New Portfolio
        </button>
      </div>

      {/* Portfolio Cards */}
      {filteredPortfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPortfolioItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={() => {
                activeTab === "my_portfolio"
                  ? openPersonalModal(item.id)
                  : openAgencyModal(item.id);
              }}
            />
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

      {/* Add Portfolio Modal */}
      <AddPortfolioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitPortfolio={(data) => console.log("Portfolio added:", data)}
      />

      {/* Personal Portfolio Details Modal */}
      <PortfolioDetailsModal
        open={personalModalOpen}
        onClose={() => setPersonalModalOpen(false)}
        portfolioId={selectedPersonalId}
        portfolioData={portfolioDetailsData} // use detailed data here!
        user={{
          name: "John Doe",
          role: "Influencer",
          avatar: "https://i.pravatar.cc/150?img=3",
        }}
      />

      {/* Agency Portfolio Details Modal */}
      <AgencyPortfolioDetailsModal
        open={agencyModalOpen}
        onClose={() => setAgencyModalOpen(false)}
        portfolioId={selectedAgencyId}
        portfolioData={agencyPortfolioDetailsData} // use detailed data here!
        user={{
          name: "Agency Name",
          role: "Marketing Agency",
          avatar: "https://i.pravatar.cc/150?img=3",
        }}
      />
    </section>
  );
}
