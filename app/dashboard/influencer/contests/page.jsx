"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TabSwitcher from "@/components/common/TabSwitcher";
import ContestCard from "@/components/contests/ContestCard";
import CreateContestModal from "@/components/contests/CreateContestModal";
import {
  useGetParticipatedContestsQuery,
  useGetMyContestsQuery,
  useGetAllContestsQuery,
} from "@/redux/api/services/contestApi";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "my", label: "My Contest" },
  { key: "contest", label: "Contest" },
  { key: "participated", label: "Participated" },
];

// ─── Normalize API responses to card props ────────────────────────────────────

function normalize(item) {
  return {
    id: item.id,
    title: item.title,
    hostBy: item.host_by ?? item.creator?.name ?? "A. R. Rahman",
    prize: item.prize,
    endDate: item.end_date,
    description: item.description ?? "Show your best summer f...",
    totalSlots: item.total_slots ?? 100,
    totalParticipants: item.total_participants ?? 0,
    prizePhotoUrl: item.prize_photo_url ?? null,
  };
}

// ─── Tab panel ────────────────────────────────────────────────────────────────

function TabPanel({ query }) {
  const { data, isLoading, isError, refetch } = query;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
          >
            <div className="w-full aspect-[16/9] bg-gray-200" />
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-3 bg-gray-200 rounded-full" />
              ))}
              <div className="h-9 bg-gray-200 rounded-xl mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">Failed to load contests</p>
        <button
          onClick={refetch}
          className="mt-2 text-sm text-primary hover:underline cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  const items = data?.data ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">No contests found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map(item => (
        <ContestCard key={item.id} {...normalize(item)} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState("my");
  const [modalOpen, setModalOpen] = useState(false);

  const myQuery = useGetMyContestsQuery(undefined, {
    skip: activeTab !== "my",
  });
  const allQuery = useGetAllContestsQuery(undefined, {
    skip: activeTab !== "contest",
  });
  const participatedQuery = useGetParticipatedContestsQuery(undefined, {
    skip: activeTab !== "participated",
  });

  // Refetch the active tab after creating a contest
  const handleCreated = () => {
    if (activeTab === "my") myQuery.refetch?.();
  };

  const activeQuery =
    activeTab === "my"
      ? myQuery
      : activeTab === "contest"
        ? allQuery
        : participatedQuery;

  return (
    <>
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-black">Contests</h1>
          <p className="text-sm text-gray mt-0.5">
            <span className="text-primary font-medium">Dashboard</span>
            {" / "}
            <span>Contests</span>
          </p>
        </div>

        {/* Toolbar: tabs + Create button */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabSwitcher tabs={TABS} active={activeTab} onChange={setActiveTab} />

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            <Plus size={15} />
            Create Contest
          </button>
        </div>

        {/* Content */}
        <TabPanel query={activeQuery} />
      </div>

      {/* Modal */}
      <CreateContestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleCreated}
      />
    </>
  );
}
