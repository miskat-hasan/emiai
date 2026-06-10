// // app/dashboard/influencer/contests/[id]/page.jsx
// "use client";

// import Image from "next/image";
// import { Bookmark, QrCode, Share2, Pencil } from "lucide-react";

// export default function ContestDetailsPage() {
//   const contest = {
//     title: "Best Summer Fashion Reel",
//     banner: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
//     hostBy: "A.R Rahman",
//     participants: "45/100",
//     funds: "$6000",
//     prize: "PS5",
//     endDate: "Feb 15, 2026",
//     timeLeft: "32 Days",
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-black">Contests</h1>
//         <p className="text-sm text-gray-500">
//           <span className="text-primary font-medium">Dashboard</span>
//           {" / "}
//           <span>Contests</span>
//           {" / "}
//           <span className="text-black">Contests Details</span>
//         </p>

//         <div className="mt-3 text-lg font-semibold">{contest.title}</div>
//       </div>

//       <div className="flex justify-end gap-3 -mt-14">
//         <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
//           <Bookmark size={16} />
//         </button>
//         <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
//           <QrCode size={16} />
//         </button>
//         <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
//           <Share2 size={16} />
//         </button>
//         <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center">
//           <Pencil size={16} />
//         </button>
//       </div>

//       <div className="relative w-full h-[360px] lg:h-[400px] rounded-2xl overflow-hidden mt-2">
//         <Image
//           src={contest.banner}
//           alt="banner"
//           fill
//           className="object-cover"
//         />
//       </div>

//       <div className="flex justify-end">
//         <button className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:opacity-90">
//           Announce Winner
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white rounded-2xl p-5">
//           <h2 className="lg:text-base border-b border-gray-200 pb-4 text-sm text-gray-500 mb-2">
//             Contest Title:{" "}
//             <span className="text-black font-semibold">{contest.title}</span>
//           </h2>

//           <p className="text-sm text-gray-600 leading-relaxed">
//             Based on the timeframe and title, you are likely referring to the
//             Digital Marketing World Forum (DMWF) Global 2026, which is the most
//             prominent international event with this branding...
//             <br />
//             <br />
//             This is a definitive event for senior leaders driving the future of
//             marketing technology. It brings together over 3,000 attendees and
//             100+ exhibitors to discuss the latest trends in the industry.
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl p-5 space-y-4">
//           <h2 className="lg:text-base border-b border-gray-200 pb-4 font-semibold">
//             Contest details
//           </h2>

//           <div className="space-y-3 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-500">Host By</span>
//               <span className="font-medium">{contest.hostBy}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">Participants</span>
//               <span className="font-medium">{contest.participants}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">Founds</span>
//               <span className="font-medium">{contest.funds}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">Prize</span>
//               <span className="font-medium">{contest.prize}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">End Date</span>
//               <span className="font-medium">{contest.endDate}</span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-500">Time Left</span>
//               <span className="font-medium">{contest.timeLeft}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-5">
//           <h2 className="lg:text-base border-b border-gray-200 pb-4 font-semibold mb-4">
//             Participants
//           </h2>

//           <div className="space-y-4">
//             {[
//               { name: "Jane Cooper", role: "Influencer" },
//               { name: "Jane Cooper", role: "Influencer" },
//               { name: "Jenny Wilson", role: "Advertiser" },
//               { name: "Floyd Miles", role: "Guest" },
//             ].map((p, i) => (
//               <div key={i} className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gray-200" />

//                 <div>
//                   <div className="flex items-center gap-1">
//                     <p className="text-sm font-medium">{p.name}</p>
//                     <p className="text-xs text-gray-500">({p.role})</p>
//                   </div>
//                   <p className="text-xs text-gray-500">2 hours ago</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Bookmark, QrCode, Share2, Pencil } from "lucide-react";
import {
  useGetSingleContestQuery,
  useAnnounceWinnerMutation,
  useJoinContestMutation,
} from "@/redux/api/services/contestApi";

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

// ─── Role badge color ─────────────────────────────────────────────────────────

const ROLE_COLORS = {
  influencer: "text-[#F57802]",
  advertiser: "text-[#125896]",
  agency: "text-[#DE4385]",
  business_manager: "text-[#B05EE0]",
  guest: "text-[#D20061]",
  admin: "text-gray-400",
};

// ─── Icon action buttons (top-right) ─────────────────────────────────────────

function ActionIcon({ icon: Icon, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-[#63716E] hover:text-primary hover:border-primary/40 transition-colors shadow-sm"
    >
      <Icon size={15} />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContestDetailPage({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  // variant comes from the card's href: /contests/[id]?v=my|contest|participated
  const variant = searchParams.get("v") ?? "contest";

  const currentUser = useSelector(state => state.auth?.user);

  const { data, isLoading, isError } = useGetSingleContestQuery(id);
  const [announceWinner, { isLoading: isAnnouncing }] =
    useAnnounceWinnerMutation();
  const [joinContest, { isLoading: isJoining }] = useJoinContestMutation();

  const c = data?.data;

  // ── Total funds from sponsorships ──
  const totalFunds =
    c?.sponsorships?.reduce((sum, s) => sum + (s.amount ?? 0), 0) ?? 0;

  const handleAnnounceWinner = async () => {
    try {
      await announceWinner({ contest_id: id }).unwrap();
      toast.success("Winner announced!");
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to announce winner.");
    }
  };

  const handleJoin = async () => {
    try {
      await joinContest({ contest_id: id }).unwrap();
      toast.success("Successfully joined the contest!");
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
      <div className="flex flex-col items-center justify-center py-24 text-[#63716E]">
        <p className="text-base font-medium">Failed to load contest details</p>
        <Link
          href="/dashboard/influencer/contests"
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
          <h1 className="text-2xl font-bold text-[#203430]">Contests</h1>
          <p className="text-sm text-[#63716E] mt-0.5">
            <span className="text-primary font-medium">Dashboard</span>
            {" / "}
            <Link
              href="/dashboard/influencer/contests"
              className="text-primary font-medium hover:underline"
            >
              Contests
            </Link>
            {" / "}
            <span className="text-[#203430]">Contest Details</span>
          </p>
          <p className="text-lg font-semibold text-[#203430] mt-2">{c.title}</p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <ActionIcon icon={Bookmark} title="Bookmark" />
          <ActionIcon icon={QrCode} title="QR Code" />
          <ActionIcon icon={Share2} title="Share" />
          {isMyContest && <ActionIcon icon={Pencil} title="Edit contest" />}
        </div>
      </div>

      {/* ── Banner ── */}
      <div className="relative w-full h-[340px] lg:h-[380px] rounded-2xl overflow-hidden">
        {c.prize_photo_url ? (
          <Image
            src={c.prize_photo_url}
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

      {/* ── CTA row below banner ── */}
      {isMyContest && (
        <div className="flex justify-end">
          <button
            onClick={handleAnnounceWinner}
            disabled={isAnnouncing}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20"
          >
            {isAnnouncing ? "Announcing..." : "Announce Winner"}
          </button>
        </div>
      )}

      {isContestView && (
        <div className="flex items-center justify-end gap-4">
          <span className="text-xl font-bold text-[#203430]">
            {c.entry_fee && Number(c.entry_fee) > 0
              ? `$${Number(c.entry_fee).toLocaleString()}`
              : "Free"}
          </span>
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20"
          >
            {isJoining ? "Joining..." : "Join Contest"}
          </button>
        </div>
      )}

      {/* ── Three-column content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Col 1 — Description */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="text-sm font-semibold text-[#203430] border-b border-gray-100 pb-3 mb-3">
            Contest Title : <span className="font-bold">{c.title}</span>
          </h2>
          <p className="text-sm text-[#63716E] leading-relaxed whitespace-pre-line">
            {c.description ?? "No description provided."}
          </p>
          {c.rules && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#203430] mb-1">Rules</p>
              <p className="text-xs text-[#63716E] leading-relaxed">
                {c.rules}
              </p>
            </div>
          )}
        </div>

        {/* Col 2 — Contest details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="text-sm font-semibold text-[#203430] border-b border-gray-100 pb-3 mb-4">
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
                <span className="text-[#63716E] shrink-0">{label}</span>
                <span className="font-semibold text-[#203430] text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3 — Participants */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
          <h2 className="text-sm font-semibold text-[#203430] border-b border-gray-100 pb-3 mb-4">
            Participants
          </h2>

          {c.participants && c.participants.length > 0 ? (
            <div className="space-y-4">
              {c.participants.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <UserAvatar avatar={p.avatar} name={p.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#203430] leading-tight">
                      {p.name}{" "}
                      <span
                        className={`text-xs font-medium capitalize ${ROLE_COLORS[p.role] ?? "text-gray-400"}`}
                      >
                        ({p.role})
                      </span>
                    </p>
                    <p className="text-xs text-[#63716E] mt-0.5">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          ) : /* Collaborators as fallback when no participants yet */
          c.collaborators && c.collaborators.length > 0 ? (
            <div className="space-y-4">
              {c.collaborators.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <UserAvatar avatar={p.avatar} name={p.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#203430] leading-tight">
                      {p.name}{" "}
                      <span
                        className={`text-xs font-medium capitalize ${ROLE_COLORS[p.role] ?? "text-gray-400"}`}
                      >
                        ({p.role})
                      </span>
                    </p>
                    <p className="text-xs text-[#63716E] mt-0.5">
                      {p.pivot?.status ?? "invited"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#63716E]">No participants yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}