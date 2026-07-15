"use client";

import { Check, CheckCheck, Clock } from "lucide-react";

// message.statuses is one entry per recipient: { user_id, status, ... }
// where status is "sent" | "delivered" | "seen" (per the documented shape).
// For a group, the overall indicator reflects the *worst* (least-progressed)
// status across all recipients — matches how most chat apps show group
// read receipts (single check until everyone has at least delivered, etc.)
const STATUS_RANK = { sent: 0, delivered: 1, seen: 2 };

function getOverallStatus(statuses) {
  if (!statuses || statuses.length === 0) return null;
  const worst = statuses.reduce((min, s) => {
    const rank = STATUS_RANK[s.status] ?? 0;
    return rank < min ? rank : min;
  }, 2);
  return (
    Object.keys(STATUS_RANK).find(key => STATUS_RANK[key] === worst) ?? "sent"
  );
}

export default function MessageStatusTicks({ statuses }) {
  const status = getOverallStatus(statuses);
  if (!status) return <Clock size={12} className="text-gray-300" />;

  if (status === "seen") {
    return <CheckCheck size={14} className="text-primary" />;
  }
  if (status === "delivered") {
    return <CheckCheck size={14} className="text-gray-400" />;
  }
  return <Check size={14} className="text-gray-400" />;
}
