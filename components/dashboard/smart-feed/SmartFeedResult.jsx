// components/dashboard/smart-feed/SmartFeedResult.jsx
"use client";
import { Lightbulb, TrendingUp } from "lucide-react";
import IdeaCard from "./IdeaCard";

export default function SmartFeedResult({ result }) {
  return (
    <div className="space-y-5 rounded-2xl border border-[#ECECEC] bg-[#FBFBFB] p-5">
      <div>
        <p className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#202326]">
          Content ideas
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {result.ideas?.map((idea, i) => (
            <IdeaCard key={i} idea={idea} />
          ))}
        </div>
      </div>

      {result.trending_topics?.length > 0 && (
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-[#202326]">
            <TrendingUp size={13} /> Trending topics
          </p>
          <div className="flex flex-wrap gap-2">
            {result.trending_topics.map((topic, i) => (
              <span
                key={i}
                className="rounded-full border border-[#ECECEC] bg-white px-3 py-1.5 text-[12px] font-medium text-[#3d4744]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.tip && (
        <div className="flex items-start gap-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-[12.5px] font-medium leading-[1.5] text-[#202326]">
            {result.tip}
          </p>
        </div>
      )}
    </div>
  );
}
