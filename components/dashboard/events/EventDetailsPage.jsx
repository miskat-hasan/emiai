"use client";

import { use, useState } from "react";
import Link from "next/link";
import EventHeroImage from "./EventHeroImage";
import EventDescription from "./EventDescription";
import EventInfoCard from "./EventInfoCard";
import EventLocation from "./EventLocation";
import EventParticipants from "./EventParticipants";
import MyEventActionButtons from "./MyEventActionButtons";
import { useGetEventByIdQuery } from "@/redux/api/services/eventApi";
import dynamic from "next/dynamic";
import UpComingEventsActionButton from "./UpComingEventsActionButton";
import BuyTicketModal from "./BuyTicketModal";
const CreateEventModal = dynamic(() => import("./CreateEventModal"), {
  ssr: false,
});

const EventDetailsSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {/* Page heading skeleton */}
    <div className="h-8 w-32 bg-gray-200 rounded"></div>
    <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>

    {/* Title + Action Buttons */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
      <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
    </div>

    {/* Hero Image */}
    <div className="w-full h-[300px] md:h-[400px] bg-gray-200 rounded-[2rem] mt-4"></div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <div className="lg:col-span-2">
        <div className="h-64 bg-gray-200 rounded-3xl"></div>
      </div>
      <div className="lg:col-span-1">
        <div className="h-64 bg-gray-200 rounded-3xl"></div>
      </div>
    </div>

    {/* Bottom Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
      <div className="lg:col-span-2">
        <div className="h-64 bg-gray-200 rounded-3xl"></div>
      </div>
      <div className="lg:col-span-1">
        <div className="h-64 bg-gray-200 rounded-3xl"></div>
      </div>
    </div>
  </div>
);

/**
 * Shared Event Details page — Client Component.
 * @param {{ role: string, params: Promise<{ id: string }> }} props
 */
export default function EventDetailsPage({ role, params }) {
  const { id } = use(params);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { data: response, isLoading } = useGetEventByIdQuery(id);

  const rawEvent = response?.data;

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (!rawEvent) {
    return (
      <div className="flex justify-center py-20 text-gray">
        <p>Event not found.</p>
      </div>
    );
  }

  const event = {
    id: rawEvent.event_id || rawEvent.id || id,
    is_bookmarked: rawEvent.is_bookmarked,
    title: rawEvent.name || "Event Title",
    location: rawEvent.location,
    sponsor: rawEvent.sponsors?.[0]?.sponsor?.name || "N/A",
    date: rawEvent.start_date,
    eventType: rawEvent.event_type || "Offline(Check Backend Response)",
    participants: rawEvent.participants.length || 0,
    imageUrl: rawEvent.photo
      ? `${process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team"}/${rawEvent.photo}`
      : null,
    mapUrl: rawEvent.full_location,
    description: rawEvent.description || "No description provided.",
  };

  const formattedParticipants =
    rawEvent.participants?.map((p) => ({
      ...p,
      time: p.joined_at,
    })) || [];

  const infoItems = [
    { label: "Event Type", value: event.eventType },
    { label: "Participants", value: String(event.participants) },
    { label: "Sponsored", value: event.sponsor },
    { label: "Location", value: event.location },
    { label: "Event Start", value: event.date },
  ];

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">Events</h1>
        <p className="text-sm text-gray mt-0.5">
          <Link
            href={`/dashboard/${role}`}
            className="text-primary font-medium hover:underline"
          >
            Dashboard
          </Link>
          {" / "}
          <Link
            href={`/dashboard/${role}/events`}
            className="text-primary font-medium hover:underline"
          >
            Events
          </Link>
          {" / "}
          <span>Event Details</span>
        </p>
      </div>

      {/* Title + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-black">
          {event.title}
        </h2>
        <UpComingEventsActionButton
          eventId={event.id}
          initialBookmarked={event.is_bookmarked}
          onJoin={() => {
            setBuyModalOpen(true);
          }}
        />
      </div>

      {/* Hero Image */}
      {event.imageUrl && (
        <EventHeroImage imageUrl={event.imageUrl} alt={event.title} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <EventDescription
            title={event.title}
            description={event.description}
          />
        </div>
        <div className="lg:col-span-1">
          <EventInfoCard items={infoItems} />
        </div>
      </div>

      {/* Bottom Grid*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <EventLocation mapUrl={event.mapUrl} />
        </div>
        <div className="lg:col-span-1">
          <EventParticipants participants={formattedParticipants} />
        </div>
      </div>

      <CreateEventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
      />
      <BuyTicketModal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        event={rawEvent}
      />
    </div>
  );
}
