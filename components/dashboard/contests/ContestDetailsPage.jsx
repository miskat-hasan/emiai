// components/dashboard/contests/ContestDetailsPage.jsx
"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Bookmark, QrCode, Share2, Pencil } from "lucide-react";
import {
  useGetSingleContestQuery,
  useAnnounceWinnerMutation,
  useJoinContestMutation,
} from "@/redux/api/services/contestApi";
import AnnounceWinnerModal from "./AnnounceWinnerModal";
import JoinContestModal from "./JoinContestModal";
import CreateContestModal from "./CreateContestModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeLeft(endDate) {
  if (!endDate) return "—";
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} Days`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const getDaysAgo = dateString => {
  const created = new Date(dateString);
  const now = new Date();

  // Reset hours to compare calendar days, or keep them to compare exact 24-hour periods
  const diffTime = now - created;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    // Optional: Handle if it was created just hours ago
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
};

// ─── Avatar with initials fallback ───────────────────────────────────────────

function UserAvatar({ avatar, name, size = 10 }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-white text-sm font-bold">{name?.[0] ?? "?"}</span>
      )}
    </div>
  );
}

// ─── Icon action buttons (top-right) ─────────────────────────────────────────

function ActionIcon({ icon: Icon, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray hover:text-primary hover:border-primary/40 transition-colors shadow-sm cursor-pointer"
    >
      <Icon size={15} />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContestDetailsPage({ params, role }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winnerIds, setWinnerIds] = useState([]);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const variant = searchParams.get("v") ?? "contest";

  const { data, isLoading, isError } = useGetSingleContestQuery(id);
  const [announceWinner, { isLoading: isAnnouncing }] =
    useAnnounceWinnerMutation();
  const [joinContest, { isLoading: isJoining }] = useJoinContestMutation();

  const c = data?.data;

  // ── Total funds from sponsorships ──
  const totalFunds =
    c?.sponsorships?.reduce((sum, s) => sum + (s.amount ?? 0), 0) ?? 0;

  const participantOptions =
    c?.participants?.map(user => ({
      id: user.id,
      name: user.name,
    })) || [];

  const handleAnnounceWinner = async () => {
    if (!winnerIds.length) {
      toast.error("Please select at least one winner.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("contest_id", id);

      winnerIds.forEach(id => {
        formData.append("winner_ids[]", id);
      });

      await announceWinner(formData).unwrap();

      toast.success("Winner announced!");

      setWinnerModalOpen(false);
      setWinnerIds([]);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to announce winner.");
    }
  };

  const handleJoin = async () => {
    try {
      await joinContest(id).unwrap();
      toast.success("Successfully joined the contest!");
      setJoinModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to join contest.");
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-full" />
        <div className="w-full h-[360px] bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !c) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray">
        <p className="text-base font-medium">Failed to load contest details</p>
        <Link
          href={`/dashboard/${role}/contests`}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Back to Contests
        </Link>
      </div>
    );
  }

  const isMyContest = variant === "my";
  const isContestView = variant === "contest";
  const isParticipated = variant === "participated";

  return (
    <div className="space-y-5">
      {/* ── Breadcrumb + title ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Contests</h1>
          <p className="text-sm text-gray mt-0.5">
            <span className="text-primary font-medium">Dashboard</span>
            {" / "}
            <Link
              href={`/dashboard/${role}/contests`}
              className="text-primary font-medium hover:underline"
            >
              Contests
            </Link>
            {" / "}
            <span className="text-black">Contest Details</span>
          </p>
          <p className="text-lg font-semibold text-black mt-2">{c.title}</p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <ActionIcon icon={Bookmark} title="Bookmark" />
          <ActionIcon icon={QrCode} title="QR Code" />
          <ActionIcon icon={Share2} title="Share" />
          {isMyContest && (
            <ActionIcon
              icon={Pencil}
              title="Edit contest"
              onClick={() => setEditModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="relative w-full h-[340px] lg:h-[380px] rounded-2xl overflow-hidden">
        {c.prize_photo_url ? (
          <Image
            src={process.env.NEXT_PUBLIC_API_URL + "/" + c.prize_photo_url}
            alt={c.title}
            fill
            className="object-cover"
          />
        ) : (
          /* No image — show prize as centered text on gradient bg */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
            }}
          >
            <p className="text-white font-bold text-5xl drop-shadow-lg">
              ${Number(c.prize ?? 0).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ── CTA row below banner ──
          my: Announce Winner | contest: Join Contest (opens modal) | participated: none */}
      {isMyContest && (
        <div className="flex justify-end">
          <button
            onClick={() => setWinnerModalOpen(true)}
            disabled={isAnnouncing}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
          >
            {isAnnouncing ? "Announcing..." : "Announce Winner"}
          </button>
        </div>
      )}

      {isContestView && (
        <div className="flex items-center justify-end gap-4">
          <span className="text-xl font-bold text-black">
            {c.entry_fee === undefined || c.entry_fee === null
              ? "—"
              : Number(c.entry_fee) > 0
                ? `$${Number(c.entry_fee).toLocaleString()}`
                : "Free"}
          </span>
          <button
            onClick={() => setJoinModalOpen(true)}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
          >
            Join Contest
          </button>
        </div>
      )}

      {/* isParticipated: no CTA row — user already joined */}

      {/* ── Three-column content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Col 1 — Description */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="text-sm font-semibold text-black border-b border-gray-100 pb-3 mb-3">
            Contest Title : <span className="font-bold">{c.title}</span>
          </h2>
          <p className="text-sm text-gray leading-relaxed whitespace-pre-line">
            {c.description ?? "No description provided."}
          </p>
          {c.rules && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-black mb-1">Rules</p>
              <ul>
                {c.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray leading-relaxed list-disc ml-5"
                  >
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Col 2 — Contest details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="text-sm font-semibold text-black border-b border-gray-100 pb-3 mb-4">
            Contest details
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Host By", value: c.creator?.name ?? "—" },
              {
                label: "Participants",
                value: `${c.participants_count ?? 0}/${c.total_slots ?? "—"}`,
              },
              {
                label: "Funds",
                value: totalFunds > 0 ? `$${totalFunds.toLocaleString()}` : "—",
              },
              {
                label: "Prize",
                value:
                  typeof c.prize === "number"
                    ? `$${c.prize.toLocaleString()}`
                    : (c.prize ?? "—"),
              },
              { label: "End Date", value: formatDate(c.end_date) },
              { label: "Time Left", value: timeLeft(c.end_date) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-gray shrink-0">{label}</span>
                <span className="font-semibold text-black text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3 — Participants */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="text-sm font-semibold text-black border-b border-gray-100 pb-3 mb-4">
            Participants
          </h2>

          {c.participants && c.participants.length > 0 ? (
            <div className="space-y-4">
              {c.participants.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <UserAvatar avatar={p.avatar} name={p.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black leading-tight">
                      {p.name}{" "}
                      <span className="text-xs font-medium capitalize text-primary">
                        ({p.role})
                      </span>
                    </p>
                    <p className="text-xs text-gray mt-0.5">
                      {getDaysAgo(p.pivot.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray">No participants yet.</p>
          )}
        </div>
      </div>

      <AnnounceWinnerModal
        open={winnerModalOpen}
        onClose={() => setWinnerModalOpen(false)}
        participants={participantOptions}
        value={winnerIds}
        onChange={setWinnerIds}
        onSubmit={handleAnnounceWinner}
        isLoading={isAnnouncing}
      />

      <JoinContestModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onConfirm={handleJoin}
        isLoading={isJoining}
        contest={c}
      />

      <CreateContestModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        contest={c}
      />
    </div>
  );
}
