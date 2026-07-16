"use client";

import { useState, useMemo } from "react";
import { FileText, Link2 as LinkIcon, Image as ImageIcon } from "lucide-react";
import { useGetMessagesQuery } from "@/redux/api/services/chatApi";
import Lightbox from "./Lightbox";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Reuses the exact cache entry ChatView subscribes to (same args, no q/page)
// — no extra network request. Caveat: this only reflects whichever page(s)
// of messages are already loaded (usually the most recent ~20), not full
// history. Ask backend for a dedicated conversation-media endpoint if a
// complete gallery is needed.
export default function ConversationMediaPanel({ conversationId }) {
  const [activeTab, setActiveTab] = useState("media");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const { data } = useGetMessagesQuery({ conversationId }, { skip: !conversationId });
  const messages = data?.data ?? [];

  const media = useMemo(
    () =>
      messages.flatMap((m) =>
        (m.attachments ?? [])
          .filter((a) => a.type === "image" || a.type === "video")
          .map((a) => ({ id: a.id, type: a.type, url: a.path, name: a.name })),
      ),
    [messages],
  );

  const files = useMemo(
    () =>
      messages.flatMap((m) =>
        (m.attachments ?? [])
          .filter((a) => a.type !== "image" && a.type !== "video")
          .map((a) => ({ id: a.id, url: a.path, name: a.name, size: a.size })),
      ),
    [messages],
  );

  const links = useMemo(() => {
    const found = [];
    messages.forEach((m) => {
      if (!m.message) return;
      const matches = m.message.match(URL_REGEX);
      if (matches) matches.forEach((url) => found.push({ url }));
    });
    return found;
  }, [messages]);

  const tabs = [
    { id: "media", label: "Media", count: media.length },
    { id: "files", label: "Files", count: files.length },
    { id: "links", label: "Links", count: links.length },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === t.id ? "bg-primary text-white shadow-sm shadow-primary/20" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.label}{t.count > 0 ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {activeTab === "media" &&
        (media.length > 0 ? (
          <div className="grid grid-cols-4 gap-2.5">
            {media.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(i)}
                className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
              >
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                )}
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon={ImageIcon} label="No media yet" />
        ))}

      {activeTab === "files" &&
        (files.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {files.map((f) => (
              <a
                key={f.id}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 hover:bg-white transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-primary" />
                </div>
                <p className="text-xs font-semibold text-gray-800 truncate flex-1">{f.name}</p>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState icon={FileText} label="No files yet" />
        ))}

      {activeTab === "links" &&
        (links.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 hover:bg-white transition-colors text-xs text-primary truncate"
              >
                <LinkIcon size={13} className="shrink-0" />
                <span className="truncate">{l.url}</span>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState icon={LinkIcon} label="No links yet" />
        ))}

      {lightboxIndex !== null && (
        <Lightbox items={media} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, label }) {
  return (
    <div className="py-8 text-center text-sm text-gray-400 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col items-center gap-2">
      <Icon size={20} className="text-gray-300" />
      {label}
    </div>
  );
}