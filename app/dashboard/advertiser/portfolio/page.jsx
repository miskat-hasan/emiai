"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PageLoader from "@/components/common/PageLoader";
import PortfolioCard from "@/app/dashboard/influencer/portfolio/components/PortfolioCard";
import AddPortfolioModal from "@/app/dashboard/influencer/portfolio/components/AddPortfolioModal";
import PortfolioDetailsModal from "@/app/dashboard/influencer/portfolio/components/PortfolioDetailsModal";
import { useGetPortfoliosQuery, useGetInfluencerPortfoliosQuery } from "@/redux/api/services/portfolioApi";
import AgencyPortfolioDetailsModal from "@/app/dashboard/influencer/portfolio/components/AgencyPortfolioDetailsModal";

export const portfolioTabs = [
  { label: "My Portfolio", value: "my_portfolio" },
  { label: "Influencer Portfolio", value: "influencer_portfolio" },
];

export default function PortfolioPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my_portfolio");

  const user = useSelector((state) => state.auth?.user);
  const { data: portfoliosRes, isLoading } = useGetPortfoliosQuery();
  const { data: influencerPortfoliosRes, isLoading: isLoadingInfluencer } = useGetInfluencerPortfoliosQuery(undefined, {
    skip: !(user?.role === "influencer" || user?.role === "advertiser" || user?.role === "agency" || user?.role === "business_manager"),
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team";

  const myPortfolios = useMemo(() => {
    if (!portfoliosRes?.data) return [];
    return portfoliosRes.data
      .filter((p) => String(p.user_id) === String(user?.id))
      .map((p) => ({
        id: p.id,
        type: "my_portfolio",
        title: p.title,
        details: p.description,
        image: p.media?.[0]?.media_url
          ? `${apiUrl}/${p.media[0].media_url}`
          : "",
        likes: p.likes_count ?? 0,
        views: p.views_count ?? 0,
      }));
  }, [portfoliosRes, user?.id, apiUrl]);

  // Transform influencer portfolios for agency tab display
  const agencyPortfolios = useMemo(() => {
    if (!influencerPortfoliosRes?.data) return [];
    return influencerPortfoliosRes.data.map((p) => ({
      id: p.id,
      type: "agency_portfolio",
      title: p.title,
      details: p.description,
      image: p.media?.[0]?.media_url
        ? `${apiUrl}/${p.media[0].media_url}`
        : "",
      likes: p.likes_count ?? 0,
      views: p.views_count ?? 0,
    }));
  }, [influencerPortfoliosRes, apiUrl]);

  // Build a lookup map for raw portfolio data (combined from both sources)
  const portfolioMap = useMemo(() => {
    const map = {};
    if (portfoliosRes?.data) {
      portfoliosRes.data.forEach((p) => {
        map[p.id] = p;
      });
    }
    if (influencerPortfoliosRes?.data) {
      influencerPortfoliosRes.data.forEach((p) => {
        map[p.id] = p;
      });
    }
    return map;
  }, [portfoliosRes, influencerPortfoliosRes]);

  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [selectedPersonalId, setSelectedPersonalId] = useState(null);

  const [agencyModalOpen, setAgencyModalOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);

  const filteredPortfolioItems = useMemo(() => {
    return activeTab === "my_portfolio"
      ? myPortfolios
      : agencyPortfolios;
  }, [activeTab, myPortfolios, agencyPortfolios]);

  const openPersonalModal = id => {
    setSelectedPersonalId(id);
    setPersonalModalOpen(true);
  };

  const openAgencyModal = id => {
    setSelectedAgencyId(id);
    setAgencyModalOpen(true);
  };

  // Handlers for edit flow
  const handleCardUpdate = (cardItem) => {
    const raw = portfolioMap[cardItem.id];
    if (raw) {
      setEditingPortfolio(raw);
      setEditModalOpen(true);
    }
  };

  const handleDetailsEdit = (rawPortfolio) => {
    setPersonalModalOpen(false);
    setEditingPortfolio(rawPortfolio);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditingPortfolio(null);
  };

  if (isLoading || isLoadingInfluencer) {
    return <PageLoader />;
  }

  return (
    <section className="w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {portfolioTabs.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`h-[34px] rounded-[10px] px-5 text-xs font-semibold transition-all duration-300 cursor-pointer ${isActive
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPortfolioItems.map(item => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={() => {
                activeTab === "my_portfolio"
                  ? openPersonalModal(item.id)
                  : openAgencyModal(item.id);
              }}
              onUpdate={handleCardUpdate}
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

      <AddPortfolioModal
        role="advertiser"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <PortfolioDetailsModal
        open={personalModalOpen}
        onClose={() => setPersonalModalOpen(false)}
        portfolioId={selectedPersonalId}
        user={{
          name: user?.name ?? "User",
          role: user?.role ?? "Advertiser",
          avatar: user?.avatar ?? "",
        }}
        onEdit={handleDetailsEdit}
      />

      <AgencyPortfolioDetailsModal
        open={agencyModalOpen}
        onClose={() => setAgencyModalOpen(false)}
        portfolioId={selectedAgencyId}
        user={{
          name: user?.name ?? "Agency",
          role: "Marketing Agency",
          avatar: user?.avatar ?? "",
        }}
      />

      {/* Edit Portfolio Modal */}
      <AddPortfolioModal
        role="advertiser"
        open={editModalOpen}
        onClose={handleEditClose}
        editData={editingPortfolio}
        onSubmitPortfolio={() => {
          handleEditClose();
        }}
      />
    </section>
  );
}
