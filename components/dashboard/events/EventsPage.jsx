"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import TabSwitcher from "@/components/common/TabSwitcher";
import EventCard from "./EventCard";
import MyEventCard from "./MyEventCard";
import { Ticket } from "@/components/common/Ticket";
import { useGetUpcomingEventsQuery, useGetMyEventsQuery, useGetMyTicketsQuery } from "@/redux/api/services/eventApi";

// ── Dynamic imports for heavy modals (code-split, no SSR) ──────────────────
const CreateEventModal = dynamic(() => import("./CreateEventModal"), {
  ssr: false,
});
const SendInvitationFlow = dynamic(() => import("./SendInvitationFlow"), {
  ssr: false,
});

// ── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "upcoming", label: "Upcoming Event" },
  { key: "my-event", label: "My Event" },
  { key: "my-ticket", label: "My Ticket" },
];

// ── Skeletons ───────────────────────────────────────────────────────────────

const EventCardSkeleton = memo(function EventCardSkeleton() {
  return (
    <div className="bg-white border border-gray/20 rounded-[2rem] p-3 w-full shadow-sm animate-pulse">
      <div className="w-full h-[220px] rounded-[1.5rem] bg-gray-200"></div>
      <div className="bg-gray/5 rounded-[1.5rem] p-5 mt-3 flex flex-col gap-3.5">
        <div className="flex items-start gap-4">
          <div className="h-4 bg-gray-200 rounded w-16 shrink-0"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
        <div className="flex items-start gap-4">
          <div className="h-4 bg-gray-200 rounded w-16 shrink-0"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <div className="h-4 bg-gray-200 rounded w-16 shrink-0"></div>
          <div className="flex-1 flex justify-between gap-4">
             <div className="h-4 bg-gray-200 rounded w-20"></div>
             <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
      <div className="mt-3 w-full bg-gray-200 h-[52px] rounded-2xl"></div>
    </div>
  );
});

// ── Tab Panels (memoized to avoid re-renders on tab switch) ─────────────────

const UpcomingPanel = memo(function UpcomingPanel({ events, onCardClick, onButtonClick }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">No upcoming events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {events.map(event => (
        <EventCard
          key={event.id}
          imageUrl={event.imageUrl}
          title={event.title}
          location={event.location}
          sponsor={event.sponsor}
          date={event.date}
          buttonText="Create Invite"
          onCardClick={() => onCardClick(event.id)}
          onButtonClick={() => onButtonClick && onButtonClick(event.id)}
        />
      ))}
    </div>
  );
});

const MyEventPanel = memo(function MyEventPanel({ events, onCardClick, onEditClick }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">No events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {events.map(event => (
        <MyEventCard
          key={event.id}
          imageUrl={event.imageUrl}
          title={event.title}
          description={event.description}
          organizer={event.organizer}
          date={event.date}
          onClick={() => onCardClick(event.id)}
          onEditClick={() => onEditClick(event)}
        />
      ))}
    </div>
  );
});

const MyTicketPanel = memo(function MyTicketPanel({ tickets }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray">
        <p className="text-base font-medium">No tickets found</p>
        <p className="text-sm mt-1 text-gray/70">
          Tickets for events you join will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map(ticket => (
        <Ticket
          key={ticket.id}
          title={ticket.title}
          ticketNumber={ticket.ticketNumber}
          qrCode={ticket.qrCode}
        />
      ))}
    </div>
  );
});

// ── Main Page Component ─────────────────────────────────────────────────────

/**
 * Shared Events page component used by all dashboard roles.
 * @param {{ role: string }} props — The user role (e.g. "influencer", "advertiser")
 */
export default function EventsPage({ role }) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [sendInviteModalOpen, setSendInviteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const router = useRouter();

  const handleCardClick = useCallback(
    id => {
      router.push(`/dashboard/${role}/events/${id}`);
    },
    [router, role],
  );

  const handleMyEventCardClick = useCallback(
    id => {
      router.push(`/dashboard/${role}/events/my-events/${id}`);
    },
    [router, role],
  );

  const handleCreateInviteClick = useCallback((id) => {
    setSelectedEventId(id);
    setSendInviteModalOpen(true);
  }, []);

  const upcomingQuery = useGetUpcomingEventsQuery(undefined, { skip: activeTab !== "upcoming" });
  const myEventsQuery = useGetMyEventsQuery(undefined, { skip: activeTab !== "my-event" });
  const myTicketsQuery = useGetMyTicketsQuery(undefined, { skip: activeTab !== "my-ticket" });

  const formatEvent = (event) => ({
    id: event.id,
    title: event.title,
    location: event.full_location || event.location,
    sponsor: event.event_sponsorships?.[0]?.sponsor?.name || "Event CO.",
    organizer: event.event_sponsorships?.[0]?.sponsor?.name || "Event CO.",
    date: new Date(event.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
    imageUrl: event.photo 
      ? `${process.env.NEXT_PUBLIC_API_URL || "https://oddeven.thewarriors.team"}/${event.photo}` 
      : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
    description: event.description || "Hello this is about my portfolio",
  });

  const upcomingEvents = upcomingQuery.data?.data?.map(formatEvent) || [];
  const myEvents = myEventsQuery.data?.data?.map(formatEvent) || [];
  const myTickets = myTicketsQuery.data?.data || [];

  return (
    <>
      <div className="space-y-4 font-dm-sans">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-black">Events</h1>
          <p className="text-sm text-gray mt-0.5">
            <span className="text-primary font-medium">Dashboard</span>
            {" / "}
            <span>
              {activeTab === "upcoming"
                ? "Upcoming Event"
                : activeTab === "my-event"
                  ? "My Event"
                  : "My Ticket"}
            </span>
          </p>
        </div>

        {/* Toolbar: tabs + Create button */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabSwitcher tabs={TABS} active={activeTab} onChange={setActiveTab} />

          <button
            onClick={() => {
              setEditingEvent(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            <Plus size={15} />
            Create New Event
          </button>
        </div>

        {/* Content */}

        {activeTab === "upcoming" && (
          upcomingQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
            </div>
          ) : (
            <UpcomingPanel events={upcomingEvents} onCardClick={handleCardClick} onButtonClick={handleCreateInviteClick} />
          )
        )}
        
        {activeTab === "my-event" && (
          myEventsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
            </div>
          ) : (
            <MyEventPanel 
              events={myEvents} 
              onCardClick={handleMyEventCardClick} 
              onEditClick={(event) => {
                const rawEvent = myEventsQuery.data?.data?.find(e => e.id === event.id);
                setEditingEvent(rawEvent || event);
                setModalOpen(true);
              }}
            />
          )
        )}
        
        {activeTab === "my-ticket" && (
          myTicketsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-gray/20 rounded-2xl h-[200px] w-full animate-pulse flex">
                  <div className="w-[120px] bg-gray-200 h-full rounded-l-2xl"></div>
                  <div className="p-4 flex-1 flex flex-col justify-center gap-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MyTicketPanel tickets={myTickets} />
          )
        )}
      </div>

      {/* Create Event Modal — dynamically imported */}
      <CreateEventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={() => { }}
        editingEvent={editingEvent}
      />

      <SendInvitationFlow
        eventId={selectedEventId}
        open={sendInviteModalOpen}
        onClose={() => setSendInviteModalOpen(false)}
      />
    </>
  );
}
