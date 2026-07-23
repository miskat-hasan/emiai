// app/dashboard/wallet/WalletPage.jsx
"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";
import Pagination from "@/components/ui/Pagination";
import Image from "next/image";
import AmountModal from "@/components/dashboard/wallet/AmountModal";
import {
  useGetWalletSummaryQuery,
  useGetConnectStatusQuery,
  useConnectBankAccountMutation,
  useTopUpWalletMutation,
  useWithdrawFromWalletMutation,
} from "@/redux/api/services/walletApi";

// ─── Mock data — no backend endpoint yet for these two, flagged for later ─────

const EARNING_DATA = [
  { month: "Jan", Deal: 900, Contests: 100 },
  { month: "Feb", Deal: 850, Contests: 120 },
  { month: "Mar", Deal: 800, Contests: 90 },
  { month: "Apr", Deal: 750, Contests: 110 },
  { month: "May", Deal: 820, Contests: 130 },
  { month: "Jun", Deal: 900, Contests: 120 },
  { month: "Jul", Deal: 1200, Contests: 150 },
  { month: "Aug", Deal: 1400, Contests: 130 },
  { month: "Sep", Deal: 1600, Contests: 160 },
  { month: "Oct", Deal: 1800, Contests: 140 },
  { month: "Nov", Deal: 1900, Contests: 170 },
  { month: "Dec", Deal: 2000, Contests: 150 },
];

const TRANSACTIONS = [
  {
    id: 1,
    name: "Farah Nabila",
    emp: "EMP-0320",
    title: "You received $500 for your account",
    date: "28 Jun 35",
    amount: "$3,000",
    type: "credit",
  },
  {
    id: 2,
    name: "Lina Armand",
    emp: "EMP-0312",
    title: "You Withdraw $100 for you account",
    date: "28 Jun 35",
    amount: "- $100",
    type: "debit",
  },
  {
    id: 3,
    name: "Jacob Yuen",
    emp: "EMP-0115",
    title: "Platform service $50 (10%)",
    date: "28 Jun 35",
    amount: "- $50",
    type: "debit",
  },
  {
    id: 4,
    name: "Sara Kim",
    emp: "EMP-0356",
    title: "You Withdraw $300 for you account",
    date: "28 Jun 35",
    amount: "- $300",
    type: "debit",
  },
  {
    id: 5,
    name: "Sara Kim",
    emp: "EMP-0356",
    title: "You Withdraw $300 for you account",
    date: "28 Jun 35",
    amount: "- $300",
    type: "debit",
  },
  {
    id: 6,
    name: "Farah Nabila",
    emp: "EMP-0320",
    title: "You received $200 for your account",
    date: "27 Jun 35",
    amount: "$200",
    type: "credit",
  },
];

const LOCATIONS = [
  { name: "Jordan", pct: 40, color: "#F57802" },
  { name: "Iraq", pct: 20, color: "#DE4385" },
  { name: "Palestine", pct: 10.3, color: "#0082A2" },
  { name: "KSA", pct: 16.7, color: "#B05EE0" },
  { name: "UAE", pct: 2.03, color: "#125896" },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-xs min-w-[120px]">
      <p className="font-semibold text-[#203430] mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4 mb-0.5">
          <span className="text-[#63716E]">{p.name}</span>
          <span className="font-semibold text-[#203430]">${p.value}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data, total }) {
  const SIZE = 120,
    STROKE = 18,
    R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  let offset = 0;
  const slices = data.map(d => {
    const slice = { ...d, offset, dash: (d.pct / 100) * CIRC };
    offset += slice.dash;
    return slice;
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth={STROKE}
            strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
            strokeDashoffset={-s.offset}
          />
        ))}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-[#203430]">{total}</span>
        <span className="text-xs text-[#63716E]">Country</span>
      </div>
    </div>
  );
}

export default function WalletPage({ role }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const totalPages = Math.ceil(TRANSACTIONS.length / perPage);
  const paged = TRANSACTIONS.slice((page - 1) * perPage, page * perPage);

  const { data: summaryResponse, isLoading: isLoadingSummary } =
    useGetWalletSummaryQuery();
  const { data: connectStatusResponse } = useGetConnectStatusQuery();
  const [connectBankAccount, { isLoading: isConnecting }] =
    useConnectBankAccountMutation();
  const [topUpWallet, { isLoading: isToppingUp }] = useTopUpWalletMutation();
  const [withdrawFromWallet, { isLoading: isWithdrawing }] =
    useWithdrawFromWalletMutation();

  const summary = summaryResponse?.data;
  const isBankConnected = Boolean(connectStatusResponse?.data?.connected);
  const balance = summary
    ? Number(summary.available_balance).toLocaleString()
    : "—";

  const handleConnectBank = async () => {
    try {
      const response = await connectBankAccount().unwrap();
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.success("Bank account connected");
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Bank connection isn't available yet — payments aren't fully set up on our end.",
      );
    }
  };

  const handleTopUp = async (amount, reset) => {
    try {
      await topUpWallet({ amount }).unwrap();
      toast.success("Wallet topped up successfully");
      reset();
      setTopUpOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Top-up isn't available yet — payments aren't fully set up on our end.",
      );
    }
  };

  const handleWithdraw = async (amount, reset) => {
    if (!isBankConnected) {
      toast.error("Please connect your bank account first");
      return;
    }
    try {
      await withdrawFromWallet({ amount }).unwrap();
      toast.success("Withdrawal requested successfully");
      reset();
      setWithdrawOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message || "Withdrawal failed. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Wallet</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <span className="text-primary font-medium">Dashboard</span> / Wallet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* ── Left ── */}
        <div className="space-y-6">
          {/* Monthly Earning chart — mock data, no endpoint yet */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#203430]">
                Monthly Earning
              </h2>
              <button className="flex items-center gap-1.5 text-sm font-medium text-[#203430] bg-white border border-gray-200 hover:border-primary/40 px-3 py-1.5 rounded-xl transition-colors shadow-sm cursor-pointer">
                Last Year <ChevronDown size={13} className="text-[#63716E]" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={EARNING_DATA}>
                <defs>
                  <linearGradient id="gDeal" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary, #F57802)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary, #F57802)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient id="gContests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#203430" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#203430" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${v}`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Deal"
                  stroke="var(--color-primary,#F57802)"
                  strokeWidth={2}
                  fill="url(#gDeal)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="Contests"
                  stroke="#203430"
                  strokeWidth={2}
                  fill="url(#gContests)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: 11,
                    paddingTop: 12,
                    color: "#63716E",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions — mock data, no endpoint yet */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-[#203430]">
                Recent Transaction
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50/60">
                  <tr>
                    {["Method", "Job Title", "Date", "Amount", "Status"].map(
                      h => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-[#63716E]"
                        >
                          <div className="flex items-center gap-1">
                            {h}{" "}
                            {h !== "Status" && (
                              <ChevronDown
                                size={11}
                                className="text-gray-300"
                              />
                            )}
                          </div>
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paged.map(t => (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#203430]">
                          {t.name}
                        </p>
                        <p className="text-xs text-[#63716E]">{t.emp}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#63716E] max-w-[220px]">
                        {t.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#63716E] whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#203430] whitespace-nowrap">
                        {t.amount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${t.type === "credit" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"}`}
                        >
                          {t.type === "credit" ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <XCircle size={11} />
                          )}
                          {t.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                    </tr>
                  ))}
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
                totalResults={TRANSACTIONS.length}
              />
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="space-y-5">
          {/* Account + credit card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#203430]">Account</h2>
              <button
                onClick={() => setTopUpOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                Top Up
              </button>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden p-5 text-white shadow-lg bg-gradient-to-br from-primary to-secondary"
              style={{ minHeight: 160 }}
            >
              {/* card art unchanged */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-[65px] h-[43px] bg-white/20 rounded" />
                <div className="w-[50px]">
                  <Image
                    src={getImageUrl("/glove.png")}
                    alt="card"
                    width={44}
                    height={30}
                    className="object-cover size-full"
                  />
                </div>
              </div>
              <p className="text-base font-bold tracking-widest mb-3 opacity-95">
                0000 1234 4321 9876
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">
                    Card Holder
                  </p>
                  <p className="text-sm font-semibold">MD MOSFIQUR RAHMAN</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">
                    VALID
                  </p>
                  <p className="text-sm font-semibold">02/29</p>
                </div>
              </div>
            </div>

            {/* Bank connect status */}
            <div
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 ${isBankConnected ? "bg-emerald-50" : "bg-amber-50"}`}
            >
              {isBankConnected ? (
                <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
              ) : (
                <ShieldAlert size={16} className="shrink-0 text-amber-600" />
              )}
              <p
                className={`flex-1 text-xs font-medium ${isBankConnected ? "text-emerald-700" : "text-amber-700"}`}
              >
                {isBankConnected
                  ? "Bank account connected"
                  : "Connect a bank account to withdraw"}
              </p>
              {!isBankConnected && (
                <button
                  onClick={handleConnectBank}
                  disabled={isConnecting}
                  className="shrink-0 text-xs font-bold text-primary hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {isConnecting ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>

            {/* Balance + withdraw */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#203430]">
                Current Balance
              </p>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold">
                {isLoadingSummary ? "..." : `$${balance}`}
              </span>
            </div>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              Withdraw
            </button>
          </div>

          {/* Earning location — mock, no endpoint yet */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#203430]">
                Earning Location
              </h2>
              <button className="text-[#63716E] hover:text-[#203430] transition-colors cursor-pointer">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="flex justify-center">
              <DonutChart data={LOCATIONS} total={12} />
            </div>
            <div className="space-y-2">
              {LOCATIONS.map(l => (
                <div key={l.name} className="flex items-center justify-between">
                  <span className="text-sm text-[#63716E]">{l.name}</span>
                  <span
                    className="text-xs font-bold text-white px-2 py-0.5 rounded-lg"
                    style={{ backgroundColor: l.color }}
                  >
                    {l.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AmountModal
        open={topUpOpen}
        title="Top Up Wallet"
        subtitle="Add funds to your wallet balance."
        submitLabel="Top Up"
        isSubmitting={isToppingUp}
        onSubmit={handleTopUp}
        onClose={() => setTopUpOpen(false)}
      />

      <AmountModal
        open={withdrawOpen}
        title="Withdraw Funds"
        subtitle="Funds will be sent to your connected bank account."
        submitLabel="Withdraw"
        isSubmitting={isWithdrawing}
        onSubmit={handleWithdraw}
        onClose={() => setWithdrawOpen(false)}
      />
    </div>
  );
}
