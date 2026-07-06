"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ADVERTISER_GOALS = [
  "Brand Awareness",
  "Lead Generation",
  "Sales Growth",
  "Audience Engagement",
];
const CATEGORIES = [
  "Gaming & Entertainment",
  "Family Vlogs",
  "Culture & Thought",
  "Travel & Adventure",
  "Entertainment & Lifestyle",
  "Art & Fashion",
  "Media & Lifestyle",
  "Beauty & Makeup",
];

// Fixed, realistic follower tiers. The slider snaps to these indices only.
const FOLLOWER_STEPS = [
  10000, // 10K
  25000, // 25K
  50000, // 50K
  100000, // 100K
  250000, // 250K
  500000, // 500K
  1000000, // 1M
  2500000, // 2.5M
  5000000, // 5M
  10000000, // 10M+
];

// ─── Range slider (dual thumb, continuous) ────────────────────────────────────

function RangeSlider({ label, min, max, value, onChange, format }) {
  const [low, high] = value;

  const pctLow = ((low - min) / (max - min)) * 100;
  const pctHigh = ((high - min) / (max - min)) * 100;
  const lowOnTop = pctLow > 50;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[#63716E]">{label}</p>
      <div className="flex items-center gap-2 text-xs text-[#203430]">
        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-lg min-w-[40px] text-center">
          {format(low)}
        </span>
        <span className="flex-1" />
        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-lg min-w-[40px] text-center">
          {format(high)}
        </span>
      </div>

      <div className="relative h-4 flex items-center mx-1">
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-200" />
        <div
          className="absolute h-1.5 rounded-full bg-secondary"
          style={{ left: `${pctLow}%`, right: `${100 - pctHigh}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={low}
          onChange={e =>
            onChange([Math.min(Number(e.target.value), high - 1), high])
          }
          className="range-thumb-input absolute inset-0 w-full h-full"
          style={{ zIndex: lowOnTop ? 5 : 3 }}
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          onChange={e =>
            onChange([low, Math.max(Number(e.target.value), low + 1)])
          }
          className="range-thumb-input absolute inset-0 w-full h-full"
          style={{ zIndex: lowOnTop ? 4 : 5 }}
          aria-label={`${label} maximum`}
        />

        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary border-2 border-white shadow"
          style={{ left: `calc(${pctLow}% - 8px)` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary border-2 border-white shadow"
          style={{ left: `calc(${pctHigh}% - 8px)` }}
        />
      </div>

      <style jsx>{`
        .range-thumb-input {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          margin: 0;
        }
        .range-thumb-input::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          background: transparent;
        }
        .range-thumb-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: grab;
        }
        .range-thumb-input::-moz-range-track {
          background: transparent;
        }
        .range-thumb-input::-moz-range-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: grab;
        }
      `}</style>
    </div>
  );
}

// ─── Stepped range slider (dual thumb, snaps to a fixed array of values) ──────
// Used for follower count so users can only land on realistic tiers
// (10K, 25K, 50K, 100K, 250K, 500K, 1M, 2.5M, 5M, 10M) instead of any integer.

function SteppedRangeSlider({ label, steps, value, onChange, format }) {
  // value here is [lowValue, highValue] in real units (e.g. 100000).
  // We convert to/from the nearest index in `steps` for the native inputs.
  const closestIndex = v => {
    let bestIdx = 0;
    let bestDiff = Infinity;
    steps.forEach((s, i) => {
      const diff = Math.abs(s - v);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    });
    return bestIdx;
  };

  const lowIdx = closestIndex(value[0]);
  const highIdx = closestIndex(value[1]);

  const lastIdx = steps.length - 1;
  const pctLow = (lowIdx / lastIdx) * 100;
  const pctHigh = (highIdx / lastIdx) * 100;
  const lowOnTop = pctLow > 50;

  const setLowIdx = idx => {
    const clamped = Math.min(idx, highIdx - 1 < 0 ? 0 : highIdx - 1);
    onChange([steps[clamped], steps[highIdx]]);
  };

  const setHighIdx = idx => {
    const clamped = Math.max(idx, lowIdx + 1 > lastIdx ? lastIdx : lowIdx + 1);
    onChange([steps[lowIdx], steps[clamped]]);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[#63716E]">{label}</p>
      <div className="flex items-center gap-2 text-xs text-[#203430]">
        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-lg min-w-[40px] text-center">
          {format(steps[lowIdx])}
        </span>
        <span className="flex-1" />
        <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-lg min-w-[40px] text-center">
          {format(steps[highIdx])}
          {highIdx === lastIdx ? "+" : ""}
        </span>
      </div>

      <div className="relative h-4 flex items-center mx-1">
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-gray-200" />
        <div
          className="absolute h-1.5 rounded-full bg-secondary"
          style={{ left: `${pctLow}%`, right: `${100 - pctHigh}%` }}
        />

        {/* Tick marks for each step so users can see the discrete stops */}
        {steps.map((_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute w-0.5 h-2 bg-white/70 rounded-full"
            style={{ left: `${(i / lastIdx) * 100}%` }}
          />
        ))}

        <input
          type="range"
          min={0}
          max={lastIdx}
          step={1}
          value={lowIdx}
          onChange={e => setLowIdx(Number(e.target.value))}
          className="range-thumb-input absolute inset-0 w-full h-full"
          style={{ zIndex: lowOnTop ? 5 : 3 }}
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={0}
          max={lastIdx}
          step={1}
          value={highIdx}
          onChange={e => setHighIdx(Number(e.target.value))}
          className="range-thumb-input absolute inset-0 w-full h-full"
          style={{ zIndex: lowOnTop ? 4 : 5 }}
          aria-label={`${label} maximum`}
        />

        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary border-2 border-white shadow"
          style={{ left: `calc(${pctLow}% - 8px)` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary border-2 border-white shadow"
          style={{ left: `calc(${pctHigh}% - 8px)` }}
        />
      </div>

      <style jsx>{`
        .range-thumb-input {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          margin: 0;
        }
        .range-thumb-input::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          background: transparent;
        }
        .range-thumb-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: grab;
        }
        .range-thumb-input::-moz-range-track {
          background: transparent;
        }
        .range-thumb-input::-moz-range-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: grab;
        }
      `}</style>
    </div>
  );
}

// ─── Multi-select tags ────────────────────────────────────────────────────────

function TagGroup({ options, selected, onChange }) {
  const toggle = opt =>
    onChange(
      selected.includes(opt)
        ? selected.filter(s => s !== opt)
        : [...selected, opt],
    );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all
              ${
                active
                  ? "bg-secondary text-white border-secondary"
                  : "bg-white text-[#63716E] border-gray-200 hover:border-secondary/50"
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Star rating picker ───────────────────────────────────────────────────────

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}>
          <Star
            size={22}
            className={
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200 fill-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function SmartMatchingFilterModal({ open, onClose, onApply }) {
  const [goals, setGoals] = useState(["Brand Awareness"]);
  const [categories, setCategories] = useState(["Gaming & Entertainment"]);
  const [priceRange, setPriceRange] = useState([5, 3900]);
  const [numRange, setNumRange] = useState([5, 18]);
  const [ageRange, setAgeRange] = useState([18, 29]);
  const [rating, setRating] = useState(3);
  const [follRange, setFollRange] = useState([10000, 250000]);

  const handleApply = () => {
    onApply?.({
      goals,
      categories,
      priceRange,
      numRange,
      ageRange,
      rating,
      follRange,
    });
    onClose();
  };

  if (!open) return null;

  const fmtK = v =>
    v >= 1000 ? `$${(v / 1000).toFixed(1).replace(".0", "")}k` : `$${v}`;
  const fmtN = v => String(v);
  const fmtFollower = v => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace(".0", "")}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
    return String(v);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-[#F0F4F8] rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 pb-2 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-base font-bold text-[#203430]">
            Smart Matching Filter
          </h2>
          <button
            onClick={onClose}
            className="text-[#63716E] hover:text-[#203430] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Advertiser goals */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#203430]">Advertiser</p>
            <TagGroup
              options={ADVERTISER_GOALS}
              selected={goals}
              onChange={setGoals}
            />
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#203430]">Category</p>
            <TagGroup
              options={CATEGORIES}
              selected={categories}
              onChange={setCategories}
            />
          </div>

          {/* Other — sliders */}
          <div className="space-y-5">
            <p className="text-sm font-semibold text-[#203430]">Other</p>
            <RangeSlider
              label="Avg Price"
              min={100}
              max={100000}
              value={priceRange}
              onChange={setPriceRange}
              format={fmtK}
            />
            <RangeSlider
              label="Number Of Influencer"
              min={1}
              max={50}
              value={numRange}
              onChange={setNumRange}
              format={fmtN}
            />
            <RangeSlider
              label="Avg Age"
              min={13}
              max={65}
              value={ageRange}
              onChange={setAgeRange}
              format={fmtN}
            />
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#63716E]">Rating</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <SteppedRangeSlider
              label="Avg Follower"
              steps={FOLLOWER_STEPS}
              value={follRange}
              onChange={setFollRange}
              format={fmtFollower}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-[#63716E] hover:text-[#203430] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-8 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
