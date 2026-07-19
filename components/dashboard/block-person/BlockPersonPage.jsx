"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MinusCircle,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import {
  useGetBlockedUsersQuery,
  useToggleBlockUserMutation,
} from "@/redux/api/services/chatApi";

import { ROLE_FILTER_OPTIONS, getRoleLabel } from "@/lib/roleLabels";

const SORT_OPTIONS = ["Name", "Type", "Date"];

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field)
    return <ChevronsUpDown size={12} className="text-gray-300" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} className="text-primary" />
  ) : (
    <ChevronDown size={12} className="text-primary" />
  );
}

function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-1.5 min-w-[160px] bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-30">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function BlockPersonPage({ role }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching } = useGetBlockedUsersQuery({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
  });

  const [toggleBlockUser] = useToggleBlockUserMutation();
  const [unblockingId, setUnblockingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const rows = (data?.data?.data ?? []).map(entry => ({
    id: entry.id,
    blockedUserId: entry.blocked?.id,
    name: entry.blocked?.name ?? "Unknown user",
    avatar: entry.blocked?.avatar,
    roleLabel: getRoleLabel(entry.blocked?.role),
    date: formatDate(entry.created_at),
    time: formatTime(entry.created_at),
    createdAt: entry.created_at,
  }));

  // Sorting is client-side, scoped to the currently loaded page only — the
  // backend doesn't document a sort param, only search/role/per_page. Ask
  // backend for a `sort_by`/`sort_dir` param if true cross-page sorting is needed.
  const sortedRows = [...rows].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "Name") cmp = a.name.localeCompare(b.name);
    else if (sortBy === "Type") cmp = a.roleLabel.localeCompare(b.roleLabel);
    else if (sortBy === "Date")
      cmp = new Date(a.createdAt) - new Date(b.createdAt);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalResults = data?.data?.total ?? 0;
  const totalPages = data?.data?.last_page ?? 1;

  const handleSort = field => {
    if (sortBy === field) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleConfirmUnblock = async () => {
    if (!confirmTarget) return;
    const { blockedUserId, name } = confirmTarget;
    setUnblockingId(blockedUserId);
    try {
      await toggleBlockUser(blockedUserId).unwrap();
      toast.success(`${name} unblocked.`);
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't unblock this user.");
    } finally {
      setUnblockingId(null);
      setConfirmTarget(null);
    }
  };

  const TH = ({ label, field }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-[#63716E] cursor-pointer select-none whitespace-nowrap"
      onClick={() => field && handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {field && <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />}
      </div>
    </th>
  );

  return (
    <div className="space-y-6 font-dm-sans">
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Block Person</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <span className="text-primary font-medium">Dashboard</span> / Block
          Person
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 flex-wrap border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#203430]">Block List</h2>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary/40 focus-within:bg-white transition-all">
              <Search size={14} className="text-[#63716E] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-sm text-[#203430] placeholder:text-[#63716E]/60 outline-none w-36"
              />
            </div>

            <Dropdown
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#203430] hover:border-primary/40 transition-colors cursor-pointer">
                  <SlidersHorizontal size={13} className="text-[#63716E]" />
                  {roleFilter ? getRoleLabel(roleFilter) : "Filter"}
                  <ChevronDown size={12} className="text-[#63716E]" />
                </button>
              }
            >
              {close =>
                ROLE_FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt.value || "all"}
                    onClick={() => {
                      setRoleFilter(opt.value);
                      setPage(1);
                      close();
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      roleFilter === opt.value
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-[#63716E] hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              }
            </Dropdown>

            <div className="flex items-center gap-2 text-sm text-[#63716E]">
              <span>Sort by:</span>
              <Dropdown
                trigger={
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#203430] hover:border-primary/40 transition-colors cursor-pointer">
                    {sortBy}{" "}
                    <ChevronDown size={12} className="text-[#63716E]" />
                  </button>
                }
              >
                {close =>
                  SORT_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setSortBy(s);
                        setSortDir("asc");
                        close();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === s
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-[#63716E] hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))
                }
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                <TH label="Name" field="Name" />
                <TH label="Type" field="Type" />
                <TH label="Date" field="Date" />
                <TH label="Time" />
                <TH label="Action" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-[#63716E]"
                  >
                    Loading...
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-[#63716E]"
                  >
                    No blocked users found
                  </td>
                </tr>
              ) : (
                sortedRows.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden shrink-0 flex items-center justify-center">
                          {p.avatar ? (
                            <Image
                              src={getImageUrl(p.avatar)}
                              alt={p.name}
                              width={36}
                              height={36}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {p.name[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#203430]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#63716E]">
                      {p.roleLabel}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#63716E]">
                      {p.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#63716E]">
                      {p.time}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setConfirmTarget({
                            blockedUserId: p.blockedUserId,
                            name: p.name,
                          })
                        }
                        disabled={unblockingId === p.blockedUserId}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-[#63716E] hover:text-red-500 text-sm font-medium transition-colors border border-gray-200 hover:border-red-200 cursor-pointer disabled:opacity-50"
                      >
                        <MinusCircle size={14} />
                        {unblockingId === p.blockedUserId
                          ? "Unblocking..."
                          : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            perPage={perPage}
            onPerPageChange={n => {
              setPerPage(n);
              setPage(1);
            }}
            totalResults={totalResults}
          />
          {isFetching && !isLoading && (
            <p className="text-[11px] text-gray-300 text-center mt-2">
              Refreshing...
            </p>
          )}
        </div>
      </div>
      {confirmTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={e => e.target === e.currentTarget && setConfirmTarget(null)}
        >
          <div className="relative w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center px-8 py-10 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Unblock &quot;{confirmTarget.name}&quot;
              </h3>
              <p className="text-sm text-gray-500 mb-8 px-2">
                Are you sure you want to unblock{" "}
                <span className="font-semibold text-gray-700">
                  &quot;{confirmTarget.name}&quot;
                </span>
                ? They&apos;ll be able to message and interact with you again.
              </p>
              <div className="flex items-center justify-center gap-6 w-full">
                <button
                  onClick={() => setConfirmTarget(null)}
                  disabled={unblockingId === confirmTarget.blockedUserId}
                  className="text-sm font-semibold text-[#006253] hover:text-[#004b40] transition-colors cursor-pointer disabled:opacity-50"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmUnblock}
                  disabled={unblockingId === confirmTarget.blockedUserId}
                  className="bg-primary text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.25)] cursor-pointer disabled:opacity-50 min-w-[90px]"
                >
                  {unblockingId === confirmTarget.blockedUserId
                    ? "Unblocking..."
                    : "Yes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
