"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

// Dummy data mapping to match the visual curve of the provided screenshot
const yearlyData = [
  { name: "Jan", thisYear: 650, lastYear: 180 },
  { name: "Feb", thisYear: 700, lastYear: 200 },
  { name: "Mar", thisYear: 880, lastYear: 320 },
  { name: "Apr", thisYear: 720, lastYear: 280 },
  { name: "May", thisYear: 880, lastYear: 250 },
  { name: "Jun", thisYear: 980, lastYear: 320 },
  { name: "Jul", thisYear: 1200, lastYear: 500 },
  { name: "Aug", thisYear: 1000, lastYear: 350 },
  { name: "Sep", thisYear: 1280, lastYear: 380 },
  { name: "Oct", thisYear: 1700, lastYear: 300 },
  { name: "Nov", thisYear: 1600, lastYear: 260 },
  { name: "Dec", thisYear: 1350, lastYear: 300 },
];

const monthlyData = [
  { name: "Week 1", thisYear: 300, lastYear: 100 },
  { name: "Week 2", thisYear: 450, lastYear: 150 },
  { name: "Week 3", thisYear: 380, lastYear: 120 },
  { name: "Week 4", thisYear: 550, lastYear: 200 },
];

const weeklyData = [
  { name: "Mon", thisYear: 80, lastYear: 30 },
  { name: "Tue", thisYear: 120, lastYear: 40 },
  { name: "Wed", thisYear: 150, lastYear: 50 },
  { name: "Thu", thisYear: 110, lastYear: 45 },
  { name: "Fri", thisYear: 180, lastYear: 60 },
  { name: "Sat", thisYear: 250, lastYear: 90 },
  { name: "Sun", thisYear: 210, lastYear: 70 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 min-w-[130px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">This Year</span>
          <span className="text-sm font-semibold text-black">
            {payload[0].value}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Last Year</span>
          <span className="text-sm font-semibold text-black">
            {payload[1].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AdsReactionChart() {
  const [filter, setFilter] = useState("Yearly");

  const currentData =
    filter === "Monthly"
      ? monthlyData
      : filter === "Weekly"
      ? weeklyData
      : yearlyData;

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[22px] font-bold text-black">Ads Reaction</h2>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-primary/10 text-black hover:bg-primary/20 transition-colors rounded-xl px-4 py-2 pr-9 text-sm font-medium outline-none cursor-pointer"
          >
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
          />
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{ top: 10, right: 0, left: -20, bottom: 15 }}
          >
            <defs>
              <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary, #f57802)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary, #f57802)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="colorLastYear" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-secondary, #eb4a35)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-secondary, #eb4a35)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f3f4f6" vertical={false} />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={15}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              ticks={[0, 100, 500, 1000, 2000]}
              domain={[0, 2000]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#d1d5db",
                strokeWidth: 1.5,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="lastYear"
              stroke="var(--color-secondary, #eb4a35)"
              strokeWidth={2.5}
              fill="url(#colorLastYear)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--color-secondary, #eb4a35)",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />

            <Area
              type="monotone"
              dataKey="thisYear"
              stroke="var(--color-primary, #f57802)"
              strokeWidth={2.5}
              fill="url(#colorThisYear)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "var(--color-primary, #f57802)",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
