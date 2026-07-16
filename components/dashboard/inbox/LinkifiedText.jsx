"use client";
import { linkifyToNodes } from "@/lib/linkify";

export default function LinkifiedText({ text, className, isSelf }) {
  const nodes = linkifyToNodes(text);
  return (
    <p className={className}>
      {nodes.map((n, i) =>
        n.type === "link" ? (
          <a
            key={i}
            href={n.href}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className={`${isSelf ? "text-white" : "text-primary"} hover:underline break-all`}
          >
            {n.value}
          </a>
        ) : (
          <span key={i}>{n.value}</span>
        ),
      )}
    </p>
  );
}
