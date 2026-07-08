"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import TabSwitcher from "@/components/common/TabSwitcher";
import Pagination from "@/components/ui/Pagination";
import {
  useGetMyContestsQuery,
  useGetAllContestsQuery,
  useGetParticipatedContestsQuery,
} from "@/redux/api/services/contestApi";
import ContestCard from "./ContestCard";

const CreateContestModal = dynamic(
  () => import("@/components/dashboard/contests/CreateContestModal"),
  { ssr: false },
);

const TABS = [
  { key: "my", label: "My Contest" },
  { key: "contest", label: "Contest" },
  { key: "participated", label: "Participated" },
];

const ROLE_TABS = {
  influencer: ["my", "contest", "participated"],
  advertiser: ["my", "contest", "participated"],
  agency: ["my"],
  guest: ["contest", "participated"],
};

const ROLE_DEFAULT_TAB = {
  influencer: "my",
  advertiser: "my",
  agency: "my",
  guest: "contest",
};

const CAN_CREATE_ROLES = ["influencer", "advertiser", "agency"];
const DEFAULT_PER_PAGE = 12;

function normalize(item, variant) {
  return {
    id: item.id,
    variant,
    title: item.title,
    hostBy: item.host_name,
    prize: item.prize,
    endDate: item.end_date,
    entryFee: item.entry_fee,
    description: item.description ?? "",
    totalSlots: item.total_slots ?? null,
    totalParticipants: item.total_participants ?? 0,
    prizePhotoUrl: item.prize_image ?? null,
  };
}

function TabPanel({
  query,
  variant,
  role,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}) {
  const { data, isFetching, isError, refetch } = query;

  if (isFetching) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {[1, 2, 3,4].map(i => (
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

  const meta = data?.data;
  const items = meta?.data ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">No contests found</p>
      </div>
    );
  }

  const totalPages = meta?.last_page ?? 1;
  const totalResults = meta?.total ?? items.length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {items.map(item => (
          <ContestCard
            key={item.id}
            {...normalize(item, variant)}
            role={role}
          />
        ))}
      </div>

      {totalResults > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          perPage={perPage}
          totalResults={totalResults}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      )}
    </div>
  );
}
export default function ContestsPage({ role }) {
  const allowedTabKeys = ROLE_TABS[role] ?? TABS.map(t => t.key);
  const displayTabs = TABS.filter(t => allowedTabKeys.includes(t.key));

  const [activeTab, setActiveTabState] = useState(
    ROLE_DEFAULT_TAB[role] ?? displayTabs[0]?.key ?? "my",
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Independent pagination state per tab
  const [pagination, setPagination] = useState({
    my: { page: 1, perPage: DEFAULT_PER_PAGE },
    contest: { page: 1, perPage: DEFAULT_PER_PAGE },
    participated: { page: 1, perPage: DEFAULT_PER_PAGE },
  });

  const setActiveTab = key => setActiveTabState(key);

  const setPage = (tab, page) =>
    setPagination(prev => ({ ...prev, [tab]: { ...prev[tab], page } }));

  const setPerPage = (tab, perPage) =>
    setPagination(prev => ({ ...prev, [tab]: { page: 1, perPage } }));

  const canCreate = CAN_CREATE_ROLES.includes(role);

  const myQuery = useGetMyContestsQuery(
    { page: pagination.my.page, per_page: pagination.my.perPage },
    { skip: activeTab !== "my" || !allowedTabKeys.includes("my") },
  );
  const allQuery = useGetAllContestsQuery(
    { page: pagination.contest.page, per_page: pagination.contest.perPage },
    { skip: activeTab !== "contest" || !allowedTabKeys.includes("contest") },
  );
  const participatedQuery = useGetParticipatedContestsQuery(
    {
      page: pagination.participated.page,
      per_page: pagination.participated.perPage,
    },
    {
      skip:
        activeTab !== "participated" ||
        !allowedTabKeys.includes("participated"),
    },
  );

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
          <TabSwitcher
            tabs={displayTabs}
            active={activeTab}
            onChange={setActiveTab}
          />

          {canCreate && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              <Plus size={15} />
              Create Contest
            </button>
          )}
        </div>

        {/* Content */}
        <TabPanel
          query={activeQuery}
          variant={activeTab}
          role={role}
          page={pagination[activeTab].page}
          perPage={pagination[activeTab].perPage}
          onPageChange={p => setPage(activeTab, p)}
          onPerPageChange={pp => setPerPage(activeTab, pp)}
        />
      </div>
      {/* Modal */}
      {canCreate && (
        <CreateContestModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleCreated}
        />
      )}
    </>
  );
}
