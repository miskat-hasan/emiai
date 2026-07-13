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
  CreditCard,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import Image from "next/image";

// ─── Mock data ────────────────────────────────────────────────────────────────

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

// ─── Custom tooltip ───────────────────────────────────────────────────────────

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

// ─── Donut chart (SVG) ────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage({ role }) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const totalPages = Math.ceil(TRANSACTIONS.length / perPage);
  const paged = TRANSACTIONS.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Wallet</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <span className="text-primary font-medium">Dashboard</span> / Wallet
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* ── Left ── */}
        <div className="space-y-6">
          {/* Monthly Earning chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#203430]">
                Monthly Earning
              </h2>
              <button className="flex items-center gap-1.5 text-sm font-medium text-[#203430] bg-white border border-gray-200 hover:border-primary/40 px-3 py-1.5 rounded-xl transition-colors shadow-sm">
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

          {/* Recent Transactions */}
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
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
                          ${
                            t.type === "credit"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-red-50 text-red-500 border border-red-100"
                          }`}
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
              <button className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
                Add Card
              </button>
            </div>

            {/* Credit card */}
            <div
              className="relative rounded-2xl overflow-hidden p-5 text-white shadow-lg bg-gradient-to-br from-primary to-secondary"
              style={{
                minHeight: 160,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                {/* <div className="w-10 h-8 rounded bg-yellow-300/80 flex items-center justify-center">
                  <div className="w-6 h-4 rounded-sm bg-yellow-400 opacity-80" />
                </div> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="65"
                  height="43"
                  viewBox="0 0 65 43"
                  fill="none"
                >
                  <path
                    d="M26.3973 8.84723H0V16.2361H19.3071C20.6387 12.961 23.1927 10.3159 26.3973 8.84723Z"
                    fill="url(#paint0_linear_2533_7656)"
                  />
                  <path
                    d="M18.2874 7.58726V6.10352e-05H8.02438C3.74196 6.10352e-05 0.274996 3.36263 0.0429688 7.58726H18.2874Z"
                    fill="url(#paint1_linear_2533_7656)"
                  />
                  <path
                    d="M44.7272 0.00244141H19.5488V7.58964H44.7272V0.00244141Z"
                    fill="url(#paint2_linear_2533_7656)"
                  />
                  <path
                    d="M18.2881 21.4282C18.2881 20.062 18.495 18.7446 18.8649 17.4977H0V25.3605H18.8649C18.495 24.1136 18.2881 22.7944 18.2881 21.4282Z"
                    fill="url(#paint3_linear_2533_7656)"
                  />
                  <path
                    d="M64.2341 7.58726C64.0038 3.36431 60.5351 6.10352e-05 56.251 6.10352e-05H45.9863V7.58726H64.2341Z"
                    fill="url(#paint4_linear_2533_7656)"
                  />
                  <path
                    d="M19.5488 21.427C19.5488 28.3639 25.1948 34.0085 32.1372 34.0085C39.0795 34.0085 44.7272 28.3639 44.7272 21.427C44.7272 14.4902 39.0795 8.84723 32.1372 8.84723C25.1948 8.84723 19.5488 14.4902 19.5488 21.427Z"
                    fill="url(#paint5_linear_2533_7656)"
                  />
                  <path
                    d="M45.9888 21.4283C45.9888 22.7945 45.782 24.112 45.4121 25.3589H64.2803V17.4961H45.4121C45.782 18.743 45.9888 20.0604 45.9888 21.4266V21.4283Z"
                    fill="url(#paint6_linear_2533_7656)"
                  />
                  <path
                    d="M44.9673 16.2361H64.2777V8.84723H37.877C41.0833 10.3143 43.6356 12.961 44.9673 16.2361Z"
                    fill="url(#paint7_linear_2533_7656)"
                  />
                  <path
                    d="M19.309 26.6181H0.00195312V34.0087H26.3993C23.1929 32.5417 20.6423 29.895 19.309 26.6181Z"
                    fill="url(#paint8_linear_2533_7656)"
                  />
                  <path
                    d="M37.877 34.0087H64.2777V26.6181H44.9673C43.6339 29.895 41.0833 32.5417 37.877 34.0087Z"
                    fill="url(#paint9_linear_2533_7656)"
                  />
                  <path
                    d="M45.9878 35.2702V42.7062H44.7268V35.2702H19.5484V42.7062H18.2874V35.2702H0.0429688C0.274996 39.4932 3.74196 42.8557 8.02438 42.8557H56.2508C60.5332 42.8557 64.0002 39.4932 64.2339 35.2702H45.9878Z"
                    fill="url(#paint10_linear_2533_7656)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2533_7656"
                      x1="58.5634"
                      y1="46.8168"
                      x2="-12.0273"
                      y2="-6.57594"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_2533_7656"
                      x1="61.3016"
                      y1="43.1858"
                      x2="-9.28245"
                      y2="-10.2019"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_2533_7656"
                      x1="69.6601"
                      y1="32.1443"
                      x2="-0.929044"
                      y2="-21.2468"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_2533_7656"
                      x1="52.9174"
                      y1="54.2826"
                      x2="-17.6734"
                      y2="0.889814"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_2533_7656"
                      x1="77.0394"
                      y1="22.3668"
                      x2="6.45362"
                      y2="-31.021"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint5_linear_2533_7656"
                      x1="61.1709"
                      y1="43.3652"
                      x2="-9.41654"
                      y2="-10.0259"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint6_linear_2533_7656"
                      x1="69.4286"
                      y1="32.447"
                      x2="-1.15704"
                      y2="-20.9424"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint7_linear_2533_7656"
                      x1="73.626"
                      y1="26.8985"
                      x2="3.03693"
                      y2="-26.4909"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint8_linear_2533_7656"
                      x1="48.7177"
                      y1="59.8287"
                      x2="-21.8698"
                      y2="6.43932"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint9_linear_2533_7656"
                      x1="63.7833"
                      y1="39.9138"
                      x2="-6.80914"
                      y2="-13.479"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                    <linearGradient
                      id="paint10_linear_2533_7656"
                      x1="53.6498"
                      y1="53.3114"
                      x2="-16.941"
                      y2="-0.0813321"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E4B15D" />
                      <stop offset="0.269" stop-color="#F0B744" />
                      <stop offset="0.537" stop-color="#FFFFE8" />
                      <stop offset="0.746" stop-color="#EFBF61" />
                      <stop offset="0.9" stop-color="#EED19A" />
                      <stop offset="1" stop-color="#D09655" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col gap-1 items-end">
                  <p className="text-xs font-semibold opacity-80 tracking-widest">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="116"
                      height="19"
                      viewBox="0 0 116 19"
                      fill="none"
                    >
                      <path
                        d="M6.74225 3.51767C4.45561 3.51767 3.39466 5.63503 3.39466 9.58239C3.39466 13.2659 4.74481 15.2404 7.03314 15.2404C8.62202 15.2404 9.97045 14.4456 11.2231 13.4827C11.8956 13.9163 12.5951 14.8304 12.7632 15.5765C11.4164 16.9259 9.03059 18.0569 6.47828 18.0569C1.61411 18.0569 0 13.7717 0 9.55887C0 3.5412 3.13069 0.91803 6.83977 0.91803C10.5018 0.91803 12.8372 3.15638 12.8372 5.77955C12.8372 6.98275 12.2117 7.58603 11.0062 7.58603C10.5236 7.58603 10.1621 7.51209 9.72835 7.4163C9.77711 5.49219 9.10456 3.51767 6.74225 3.51767Z"
                        fill="url(#paint0_linear_2533_7675)"
                      />
                      <path
                        d="M15.6252 5.58652C16.9736 5.75457 17.8395 6.54773 18.2969 7.75261C18.8265 6.52589 19.7664 5.61005 21.3569 5.61005C21.9589 5.61005 22.3439 5.65878 22.7995 5.77809C22.7995 6.54774 22.5608 7.85008 22.0312 8.71382C21.6697 8.59451 21.2847 8.56931 20.9215 8.54578C19.8387 8.54578 19.1644 9.17259 18.6584 10.038V17.7176C18.2246 17.7882 17.6227 17.8386 17.0695 17.8386C16.5415 17.8386 15.9598 17.7882 15.5024 17.7176V9.70025C15.5024 8.35421 14.9964 7.55768 14.6113 7.21991C14.7324 6.66704 15.1914 5.89572 15.6252 5.58484V5.58652Z"
                        fill="url(#paint1_linear_2533_7675)"
                      />
                      <path
                        d="M26.5582 12.7599C26.654 14.3967 27.1836 15.5999 29.0146 15.5999C30.1697 15.5999 31.2542 15.2386 32.2664 14.7815C32.7489 15.2621 33.0617 16.057 33.1575 16.6821C31.952 17.5492 30.2202 18.0533 28.5321 18.0533C24.4867 18.0533 23.3535 15.0201 23.3535 11.7937C23.3535 8.1841 24.9676 5.43994 28.559 5.43994C31.7132 5.43994 33.4719 7.65476 33.4719 10.5434C33.4719 11.4828 33.3996 12.0105 33.2063 12.7583H26.5599L26.5582 12.7599ZM26.533 10.5451H30.5329V10.2561C30.5329 8.85964 29.9798 7.7035 28.5573 7.7035C27.2576 7.7035 26.6305 8.71512 26.533 10.5451Z"
                        fill="url(#paint2_linear_2533_7675)"
                      />
                      <path
                        d="M40.0907 5.53886C41.0053 5.53886 41.8242 5.82622 42.5471 6.18752V0.168167L42.7153 0.00012207H43.9208C45.197 0.00012207 45.6325 0.552991 45.6325 1.94944V14.2755C45.6325 15.1426 45.8477 15.9139 46.305 16.2735C46.1856 16.8516 45.703 17.5977 45.2709 17.9103C44.1881 17.8162 43.4383 17.2835 43.0045 16.4903C42.1873 17.4062 40.9818 18.0565 39.6081 18.0565C36.7666 18.0565 35.3711 15.5291 35.3711 11.8926C35.3711 7.68143 37.6073 5.53886 40.0907 5.53886ZM42.5471 14.2755V8.64432C41.8965 8.23429 41.2205 7.94526 40.5968 7.94526C39.3458 7.94526 38.5724 9.34339 38.5724 11.8926C38.5724 14.4419 39.3929 15.4804 40.3799 15.4804C41.0289 15.4804 41.8729 15.1661 42.5471 14.2755Z"
                        fill="url(#paint3_linear_2533_7675)"
                      />
                      <path
                        d="M52.5144 17.7189C52.0806 17.7895 51.5022 17.8399 50.949 17.8399C50.3959 17.8399 49.8141 17.7895 49.3585 17.7189V9.3419C49.3585 8.52352 49.0945 8.01771 48.274 8.01771H47.963C47.8638 7.65642 47.8184 7.31865 47.8184 6.93383C47.8184 6.57253 47.8638 6.16418 47.963 5.80289C48.6372 5.73063 49.335 5.68357 49.7923 5.68357H50.2025C51.625 5.68357 52.5144 6.64647 52.5144 8.21096V17.7189ZM48.8776 1.13294C49.2391 0.939686 49.8898 0.820374 50.443 0.820374C50.9961 0.820374 51.6973 0.939686 52.01 1.13294C52.1781 1.51944 52.2521 2.00004 52.2521 2.38487C52.2521 2.79489 52.1781 3.25198 52.01 3.6368C51.699 3.83005 50.9995 3.97288 50.443 3.97288C49.8864 3.97288 49.192 3.82837 48.8776 3.6368C48.7078 3.2503 48.6372 2.79321 48.6372 2.38487C48.6372 1.97652 48.7078 1.51944 48.8776 1.13294Z"
                        fill="url(#paint4_linear_2533_7675)"
                      />
                      <path
                        d="M62.2679 6.863C62.2679 7.27135 62.2192 7.63264 62.1233 8.01914L59.2078 7.97041V14.3023C59.2078 14.9997 59.4987 15.4097 60.2435 15.4097H61.7383C61.8829 15.8416 61.9787 16.4197 61.9787 16.9272C61.9787 17.1675 61.9787 17.4313 61.9064 17.6229C61.0893 17.7439 59.956 17.8413 59.0145 17.8413C57.0893 17.8413 56.1242 16.902 56.1242 14.9039V7.99562L54.2932 8.02082C54.1974 7.63432 54.1738 7.27303 54.1738 6.86468C54.1738 6.50338 54.1991 6.14209 54.2932 5.75727L56.1242 5.78079V4.04826C56.1242 2.65013 56.558 2.12079 57.8342 2.12079H59.038L59.2062 2.26531V5.80432L62.1216 5.75727C62.2175 6.14377 62.2662 6.50338 62.2662 6.86468L62.2679 6.863Z"
                        fill="url(#paint5_linear_2533_7675)"
                      />
                      <path
                        d="M75.8006 3.51767C73.5122 3.51767 72.453 5.63503 72.453 9.58239C72.453 13.2659 73.8014 15.2404 76.0881 15.2404C77.6787 15.2404 79.0288 14.4456 80.2797 13.4827C80.9523 13.9163 81.6517 14.8304 81.8232 15.5765C80.4714 16.9259 78.0855 18.0569 75.5349 18.0569C70.6707 18.0569 69.0566 13.7717 69.0566 9.55887C69.0566 3.5412 72.1873 0.91803 75.8964 0.91803C79.5584 0.91803 81.8938 3.15638 81.8938 5.77955C81.8938 6.98275 81.2684 7.58603 80.0628 7.58603C79.582 7.58603 79.2205 7.51209 78.785 7.4163C78.8337 5.49219 78.1595 3.51767 75.8006 3.51767Z"
                        fill="url(#paint6_linear_2533_7675)"
                      />
                      <path
                        d="M92.8726 17.9097C91.7394 17.7887 91.018 17.2594 90.5843 16.5402C89.7436 17.3552 88.5851 18.0559 87.0181 18.0559C84.5885 18.0559 83.4082 16.1772 83.4082 14.4446C83.4082 11.6282 85.5738 10.3763 88.1059 10.3763C88.6591 10.3763 89.4056 10.3763 90.1286 10.4486V9.79822C90.1286 8.54461 89.525 7.9699 88.3464 7.9699C87.2384 7.9699 85.937 8.37825 84.6844 8.8118C84.227 8.30599 83.9378 7.3683 83.8672 6.57177C85.3586 5.94665 87.5511 5.48956 89.1416 5.48956C91.3577 5.48956 93.2593 6.66924 93.2593 9.55624V14.49C93.2593 15.2865 93.4291 15.8881 93.9352 16.273C93.7872 16.851 93.3064 17.5972 92.8726 17.9097ZM90.1269 14.6144V12.5189C89.5233 12.4718 88.8726 12.4466 88.3935 12.4466C87.1408 12.4466 86.5137 13.1457 86.5137 14.2531C86.5137 15.0462 86.9945 15.6731 87.8621 15.6731C88.5851 15.6731 89.4275 15.3118 90.1286 14.616L90.1269 14.6144Z"
                        fill="url(#paint7_linear_2533_7675)"
                      />
                      <path
                        d="M96.7968 5.58652C98.1436 5.75457 99.0061 6.54773 99.4668 7.75261C99.9964 6.52589 100.935 5.61005 102.527 5.61005C103.124 5.61005 103.514 5.65878 103.968 5.77809C103.968 6.54774 103.729 7.85008 103.199 8.71382C102.838 8.59451 102.455 8.56931 102.095 8.54578C101.01 8.54578 100.334 9.17259 99.83 10.038V17.7176C99.3928 17.7882 98.7926 17.8386 98.2377 17.8386C97.7081 17.8386 97.1331 17.7882 96.6724 17.7176V9.70025C96.6724 8.35421 96.1646 7.55768 95.7812 7.21991C95.9006 6.66704 96.3563 5.89572 96.7951 5.58484L96.7968 5.58652Z"
                        fill="url(#paint8_linear_2533_7675)"
                      />
                      <path
                        d="M109.412 5.53886C110.33 5.53886 111.15 5.82622 111.871 6.18752V0.168167L112.043 0.00012207H113.247C114.523 0.00012207 114.955 0.552991 114.955 1.94944V14.2755C114.955 15.1426 115.172 15.9139 115.629 16.2735C115.508 16.8516 115.029 17.5977 114.593 17.9103C113.512 17.8162 112.764 17.2835 112.329 16.4903C111.51 17.4062 110.308 18.0565 108.934 18.0565C106.093 18.0565 104.695 15.5291 104.695 11.8926C104.695 7.68143 106.935 5.53886 109.415 5.53886H109.412ZM111.871 14.2755V8.64432C111.217 8.23429 110.545 7.94526 109.921 7.94526C108.67 7.94526 107.897 9.34339 107.897 11.8926C107.897 14.4419 108.717 15.4804 109.701 15.4804C110.353 15.4804 111.199 15.1661 111.871 14.2755Z"
                        fill="url(#paint9_linear_2533_7675)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2533_7675"
                          x1="6.41775"
                          y1="19.4449"
                          x2="6.41775"
                          y2="-3.0058"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_2533_7675"
                          x1="18.7054"
                          y1="19.4451"
                          x2="18.7054"
                          y2="-3.00559"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_2533_7675"
                          x1="28.411"
                          y1="19.4448"
                          x2="28.411"
                          y2="-3.00428"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint3_linear_2533_7675"
                          x1="40.8372"
                          y1="19.4445"
                          x2="40.8372"
                          y2="-3.00451"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint4_linear_2533_7675"
                          x1="50.1672"
                          y1="19.4447"
                          x2="50.1672"
                          y2="-3.00431"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint5_linear_2533_7675"
                          x1="58.2209"
                          y1="19.4445"
                          x2="58.2209"
                          y2="-3.00624"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint6_linear_2533_7675"
                          x1="75.4744"
                          y1="-47.4922"
                          x2="75.4744"
                          y2="-47.4922"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint7_linear_2533_7675"
                          x1="88.6709"
                          y1="19.444"
                          x2="88.6709"
                          y2="-3.00508"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint8_linear_2533_7675"
                          x1="99.8754"
                          y1="19.4451"
                          x2="99.8754"
                          y2="-3.00559"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                        <linearGradient
                          id="paint9_linear_2533_7675"
                          x1="110.16"
                          y1="19.4445"
                          x2="110.16"
                          y2="-3.00451"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B0B0B0" />
                          <stop offset="0.532" stop-color="white" />
                          <stop offset="1" stop-color="#CCCCCC" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </p>
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

            {/* Balance + withdraw */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#203430]">
                Current Balance
              </p>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold">
                $13,533
              </span>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity shadow-sm">
              Withdraw
            </button>
          </div>

          {/* Earning location */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#203430]">
                Earning Location
              </h2>
              <button className="text-[#63716E] hover:text-[#203430] transition-colors">
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
    </div>
  );
}
