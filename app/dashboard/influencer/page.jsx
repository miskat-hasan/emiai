"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import { ChevronDown } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_EARNING = [
  { month: "Jan", Deal: 1100, Contests: 700, Ads: 400, pct: "78%" },
  { month: "Feb", Deal: 1400, Contests: 900, Ads: 550, pct: "81%" },
  { month: "Mar", Deal: 1700, Contests: 1100, Ads: 700, pct: "83%" },
  { month: "Apr", Deal: 1300, Contests: 850, Ads: 500, pct: "79%" },
  { month: "May", Deal: 2000, Contests: 1300, Ads: 800, pct: "86%" },
  { month: "Jun", Deal: 2200, Contests: 1500, Ads: 950, pct: "88%" },
];

const PORTFOLIO_VIEW = [
  { month: "Jan", This: 1120, Prev: 700 },
  { month: "Feb", This: 1800, Prev: 750 },
  { month: "Mar", This: 1360, Prev: 810 },
  { month: "Apr", This: 1980, Prev: 790 },
  { month: "May", This: 1420, Prev: 860 },
  { month: "Jun", This: 1770, Prev: 900 },
  { month: "Jul", This: 1830, Prev: 456 },
  { month: "Aug", This: 1450, Prev: 700 },
  { month: "Sep", This: 1900, Prev: 950 },
  { month: "Oct", This: 2000, Prev: 1200 },
  { month: "Nov", This: 2600, Prev: 1500 },
  { month: "Dec", This: 2300, Prev: 1800 },
];


// chart button

function PeriodButton({ label }) {
  return (
    <button className="flex items-center gap-1.5 text-sm font-medium text-black bg-white border border-gray-200 hover:border-primary/40 px-3 py-1.5 rounded-xl transition-colors shadow-sm">
      {label}
      <ChevronDown size={13} className="text-[#63716E]" />
    </button>
  );
}

// bar tooltip

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-xs min-w-[130px]">
      <p className="font-semibold text-black mb-1.5">{label} 2026</p>
      {payload.map(p => (
        <div
          key={p.name}
          className="flex items-center justify-between gap-4 mb-0.5"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: p.fill }}
            />
            <span className="text-[#63716E]">{p.name}</span>
          </div>
          <span className="font-semibold text-black">
            {Math.round(
              (p.value / payload.reduce((s, x) => s + x.value, 0)) * 100,
            )}
            %
          </span>
        </div>
      ))}
    </div>
  );
}

// area chart tooltip

function LineTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-xs min-w-[140px]">
      {payload.map(p => (
        <div
          key={p.name}
          className="flex items-center justify-between gap-4 mb-0.5"
        >
          <span className="text-[#63716E]">
            {p.name === "This" ? "This month" : "Previews Month"}
          </span>
          <span className="font-semibold text-black">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// Percentage label above bar

function PctLabel(props) {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fontSize={11}
      fill="#63716E"
      fontWeight={500}
    >
      {value}
    </text>
  );
}

// Stat card

function StatCard({ label, value, unit, sublabel }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {value}
            <span className="text-sm font-medium text-gray-400 ml-1">
              {unit}
            </span>
          </p>
        </div>
      </div>
      <div className="text-xs text-gray-500 bg-primary/5 rounded-lg px-3 py-2">
        {sublabel}
      </div>
    </div>
  );
}

export default function InfluencerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pending Deals"
          value="20"
          unit="Deals"
          sublabel="Your pending deals this month is looking solid"
        />
        <StatCard
          label="Portfolio View"
          value="35k"
          unit="View"
          sublabel="You've good amount view in this month"
        />
        <StatCard
          label="Monthly Deal"
          value="62"
          unit="Deals"
          sublabel="You've good amount of deal this month"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earning */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-black">
              Monthly Earning
            </h2>
            <PeriodButton label="Last Year" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_EARNING} barSize={86}>
              <CartesianGrid stroke="#f3f4f6" vertical={false} />
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
              <Tooltip content={<BarTooltip />} cursor={{ fill: "#fafafa" }} />

              {/* Bottom segment — dark primary */}
              <Bar
                dataKey="Deal"
                stackId="a"
                fill="var(--color-secondary, #EB4A35)"
                radius={[0, 0, 0, 0]}
              >
              </Bar>

              {/* Middle segment */}
              <Bar
                dataKey="Contests"
                stackId="a"
                fill="var(--color-primary, #F57802)"
              />

              {/* Top segment */}
              <Bar
                dataKey="Ads"
                stackId="a"
                fill="#FECDC8"
                radius={[6, 6, 0, 0]}
              >
                <LabelList dataKey="pct" content={<PctLabel />} />
              </Bar>
              <Legend
                iconType="plainline"
                iconSize={8}
                wrapperStyle={{
                  fontSize: 11,
                  paddingTop: 14,
                  color: "#63716E",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio View */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-black">
              Portfolio View
            </h2>
            <PeriodButton label="Last Year" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={PORTFOLIO_VIEW}>
              <defs>
                <linearGradient id="gradThis" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="gradPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-secondary, #EB4A35)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-secondary, #EB4A35)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
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
              <Tooltip content={<LineTooltip />} />

              <Area
                type="monotone"
                dataKey="This"
                name="This month"
                stroke="var(--color-primary, #F57802)"
                strokeWidth={2}
                fill="url(#gradThis)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "var(--color-primary, #F57802)",
                  strokeWidth: 0,
                }}
              />
              <Area
                type="monotone"
                dataKey="Prev"
                name="Previews Month"
                stroke="var(--color-secondary, #EB4A35)"
                strokeWidth={1.5}
                strokeDasharray="0"
                fill="url(#gradPrev)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--color-secondary, #EB4A35)",
                  strokeWidth: 0,
                }}
              />

              <Legend
                iconType="plainline"
                iconSize={12}
                wrapperStyle={{
                  fontSize: 11,
                  paddingTop: 14,
                  color: "#63716E",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
