// components/dashboard/smart-feed/IdeaCard.jsx
"use client";
import { Video, FileText, Users } from "lucide-react";

const typeConfig = {
  video: { icon: Video, label: "Video", tone: "bg-[#eef2ff] text-[#4f63f6]" },
  post: { icon: FileText, label: "Post", tone: "bg-[#fff7c7] text-[#936800]" },
  collab: { icon: Users, label: "Collab", tone: "bg-[#dcfce7] text-[#15803d]" },
};

export default function IdeaCard({ idea }) {
  const config = typeConfig[idea.type] || typeConfig.post;
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-[#ECECEC] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${config.tone}`}
        >
          <Icon size={12} />
          {config.label}
        </span>
      </div>

      <h4 className="mb-1.5 text-[14px] font-bold leading-snug text-[#202326]">
        {idea.title}
      </h4>
      <p className="text-[12.5px] font-medium leading-[1.5] text-[#6F7774]">
        {idea.description}
      </p>
    </div>
  );
}
