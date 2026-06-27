"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import MyEventCard from "./MyEventCard";

// ── Mock data ───────────────────────────────────────────────────────────────
const UPCOMING_EVENTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: "Digital Marketing Forum 2025",
  location: "Hello this is about my portfolio",
  sponsor: "Event CO.",
  date: "Feb 17, 2026",
  imageUrl:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
}));

export default function GuestUpcomingEvents() {
  const router = useRouter();

  const handleCardClick = useCallback(
    id => {
      router.push(`/dashboard/guest/events/${id}`);
    },
    [router],
  );

  return (
    <div className="space-y-4 font-dm-sans">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Events</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Upcoming Event</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-bold text-black">Upcoming Event</h2>
      </div>

      {/* Content */}
      {UPCOMING_EVENTS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray">
          <p className="text-base font-medium">No upcoming events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {UPCOMING_EVENTS.map(event => (
            <MyEventCard
              key={event.id}
              imageUrl={event.imageUrl}
              title={event.title}
              description={event.location}
              organizer={event.sponsor}
              date={event.date}
              onClick={() => handleCardClick(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
