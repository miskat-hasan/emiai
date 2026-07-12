"use client";

import { useGetUpcomingEventsQuery } from "@/redux/api/services/eventApi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import MyEventCard from "./MyEventCard";

export default function GuestUpcomingEvents() {
  const router = useRouter();
  const { data: response, isLoading } = useGetUpcomingEventsQuery();
  let rawEvents = [];
  if (Array.isArray(response)) rawEvents = response;
  else if (Array.isArray(response?.data)) rawEvents = response.data;
  else if (Array.isArray(response?.data?.data)) rawEvents = response.data.data;

  const handleCardClick = useCallback(
    (id) => {
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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray">
          <p className="text-base font-medium">Loading events...</p>
        </div>
      ) : rawEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray">
          <p className="text-base font-medium">No upcoming events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rawEvents.map((event) => {
            let imageUrl = event.photo;
            if (!imageUrl) {
              imageUrl =
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60";
            }

            return (
              <MyEventCard
                key={event.id}
                imageUrl={imageUrl}
                title={event.title}
                description={event.description || event.location}
                organizer={event.event_sponsorships?.[0]?.sponsor?.name || "Event CO."}
                date={
                  event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD"
                }
                onClick={() => handleCardClick(event.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
