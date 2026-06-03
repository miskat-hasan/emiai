"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChevronDown, TrendingUp, Eye, Handshake } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_SPENT = [
  { month: "Jan", Deal: 1200, Contests: 800, Ads: 600 },
  { month: "Feb", Deal: 1800, Contests: 1100, Ads: 900 },
  { month: "Mar", Deal: 2200, Contests: 1400, Ads: 1100 },
  { month: "Apr", Deal: 1600, Contests: 1000, Ads: 950 },
  { month: "May", Deal: 2800, Contests: 1700, Ads: 1300 },
  { month: "Jun", Deal: 3200, Contests: 1900, Ads: 1500 },
];

const PORTFOLIO_VIEW = [
  { month: "Jan", ThisMonth: 400, PrevMonth: 300 },
  { month: "Feb", ThisMonth: 600, PrevMonth: 500 },
  { month: "Mar", ThisMonth: 800, PrevMonth: 650 },
  { month: "Apr", ThisMonth: 700, PrevMonth: 800 },
  { month: "May", ThisMonth: 900, PrevMonth: 750 },
  { month: "Jun", ThisMonth: 1100, PrevMonth: 900 },
  { month: "Jul", ThisMonth: 950, PrevMonth: 850 },
  { month: "Aug", ThisMonth: 1300, PrevMonth: 1000 },
  { month: "Sep", ThisMonth: 1200, PrevMonth: 1100 },
  { month: "Oct", ThisMonth: 1600, PrevMonth: 1200 },
  { month: "Nov", ThisMonth: 1800, PrevMonth: 1400 },
  { month: "Dec", ThisMonth: 2000, PrevMonth: 1600 },
];

const DEALS = [
  {
    id: 1,
    status: "Pending",
    person: "Lina Armand",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    offer: "SAR 4500",
    actions: [
      { label: "Decline", variant: "outline" },
      { label: "Accept", variant: "primary" },
    ],
  },
  {
    id: 2,
    status: "In Progress",
    person: "Arlene McCoy",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    offer: "SAR 4500",
    actions: [
      { label: "Decline", variant: "outline" },
      { label: "Message", variant: "primary" },
    ],
  },
  {
    id: 3,
    status: "Extension",
    person: "Arlene McCoy",
    date: "May 24, 2026",
    description: "I need a more extra time completed this task so i request some extra time…",
    offer: null,
    duration: "21 Days",
    actions: [
      { label: "Cancel", variant: "outline" },
      { label: "Accept Extension", variant: "primary" },
    ],
  },
  {
    id: 4,
    status: "Completed",
    person: "Arlene McCoy",
    date: "May 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    payout: "SAR 4500",
    actions: [
      { label: "View Rating", variant: "outline" },
      { label: "Ads was Publish", variant: "primary" },
    ],
  },
  {
    id: 5,
    status: "Completed",
    person: "Arlene McCoy",
    date: "May 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    payout: "SAR 4500",
    actions: [
      { label: "Give Rating", variant: "outline" },
      { label: "Publish Ads", variant: "primary" },
    ],
  },
  {
    id: 6,
    status: "Delivered",
    person: "Arlene McCoy",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    payout: "SAR 4500",
    actions: [
      { label: "Cancel", variant: "outline" },
      { label: "Accept Delivery", variant: "primary" },
    ],
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-600 border-blue-200",
  Extension: "bg-purple-50 text-purple-600 border-purple-200",
  Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Delivered: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

// ─── Avatar placeholder ───────────────────────────────────────────────────────

function Avatar({ name, size = 8 }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0`}
    >
      {name?.[0] ?? "?"}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, sublabel, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {value}
            <span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
      <div className="text-xs text-gray-500 bg-primary/5 rounded-lg px-3 py-2">
        {sublabel}
      </div>
    </div>
  );
}

// ─── Select dropdown ──────────────────────────────────────────────────────────

function SelectButton({ label }) {
  return (
    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
      {label}
      <ChevronDown size={12} />
    </button>
  );
}

// ─── Deal card ────────────────────────────────────────────────────────────────

function DealCard({ deal }) {
  const isExtension = deal.status === "Extension";

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
        <StatusBadge status={deal.status} />
      </div>

      {/* Person */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={deal.person} />
          <span className="text-sm font-semibold text-gray-800">{deal.person}</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{isExtension ? "Extension Date" : deal.payout ? "Delivered" : "Date"}</p>
          <p className="text-xs font-medium text-gray-700">{deal.date}</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">
            {isExtension ? "Extension Message" : "Offer Description"}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2">{deal.description}</p>
        </div>
        {deal.offer && (
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">Offer</p>
            <p className="text-sm font-bold text-gray-900">{deal.offer}</p>
          </div>
        )}
        {deal.payout && (
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">Payout</p>
            <p className="text-sm font-bold text-gray-900">{deal.payout}</p>
          </div>
        )}
        {deal.duration && (
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">Duration</p>
            <p className="text-sm font-bold text-gray-900">{deal.duration}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {deal.actions.map((action) => (
          <button
            key={action.label}
            className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-150
              ${action.variant === "primary"
                ? "bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/20"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Custom tooltip for bar chart ─────────────────────────────────────────────

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-medium text-gray-800">{p.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState("Last Year");

  return (
    <div className="space-y-6">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pending Deals"
          value="20"
          unit="Deals"
          sublabel="Your pending deals this month is looking solid"
          icon={Handshake}
        />
        <StatCard
          label="Portfolio View"
          value="35k"
          unit="View"
          sublabel="You've good amount view in this month"
          icon={Eye}
        />
        <StatCard
          label="Monthly Deal"
          value="62"
          unit="Deals"
          sublabel="You've good amount of deal this month"
          icon={TrendingUp}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Spent */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Monthly Spent</h2>
            <SelectButton label={chartPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_SPENT} barSize={18} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f9fafb" }} />
              <Bar dataKey="Deal" stackId="a" fill="#125896" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Contests" stackId="a" fill="#0082A2" />
              <Bar dataKey="Ads" stackId="a" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio View */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Portfolio View</h2>
            <SelectButton label="Last Year" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PORTFOLIO_VIEW}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 10px 25px rgba(0,0,0,.08)" }}
              />
              <Line
                type="monotone"
                dataKey="ThisMonth"
                stroke="#125896"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#125896" }}
              />
              <Line
                type="monotone"
                dataKey="PrevMonth"
                stroke="#93c5fd"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── All Deal Offers ── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">All Deal Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DEALS.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
}