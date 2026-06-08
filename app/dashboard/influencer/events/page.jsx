"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import TabSwitcher from "@/components/common/TabSwitcher";
import EventCard from "./components/EventCard";
import MyEventCard from "./components/MyEventCard";
import CreateEventModal from "./components/CreateEventModal";

//  Tabs 

const TABS = [
  { key: "upcoming", label: "Upcoming Event" },
  { key: "my-event", label: "My Event" },
  { key: "my-ticket", label: "My Ticket" },
];

//  Mock data 

const UPCOMING_EVENTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: "Digital Marketing Forum 2025",
  location: "Hello this is about my portfolio",
  sponsor: "Event CO.",
  date: "Feb 17, 2026",
  imageUrl:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
}));

const MY_EVENTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: "Digital Marketing Forum 2025",
  description: "Hello this is about my portfolio",
  organizer: "Event CO.",
  date: "Feb 17, 2026",
  imageUrl:
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=60",
}));

//  Tab panel 

function UpcomingPanel({ events, onCardClick }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#63716E]">
        <p className="text-base font-medium">No upcoming events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
        />
      ))}
    </div>
  );
}

function MyEventPanel({ events, onCardClick }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#63716E]">
        <p className="text-base font-medium">No events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {events.map(event => (
        <MyEventCard
          key={event.id}
          imageUrl={event.imageUrl}
          title={event.title}
          description={event.description}
          organizer={event.organizer}
          date={event.date}
          onClick={() => onCardClick(event.id)}
        />
      ))}
    </div>
  );
}

function MyTicketPanel() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[#63716E]">
      <p className="text-base font-medium">No tickets found</p>
      <p className="text-sm mt-1 text-[#63716E]/70">
        Tickets for events you join will appear here
      </p>
    </div>
  );
}

//  Page 

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleCardClick = id => {
    router.push(`/dashboard/influencer/events/${id}`);
  };

  const handleMyEventCardClick = id => {
    router.push(`/dashboard/influencer/events/my-events/${id}`);
  };

  // when backend is ready we will use these hooks to fetch data
  // const upcomingQuery = useGetUpcomingEventsQuery(undefined, { skip: activeTab !== "upcoming" });
  // const myEventsQuery = useGetMyEventsQuery(undefined, { skip: activeTab !== "my-event" });
  // const myTicketsQuery = useGetMyTicketsQuery(undefined, { skip: activeTab !== "my-ticket" });

  return (
    <>
      <div className="space-y-4">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold text-[#203430]">Events</h1>
          <p className="text-sm text-[#63716E] mt-0.5">
            <span className="text-primary font-medium">Dashboard</span>
            {" / "}
            <span>{activeTab === "upcoming" ? "Upcoming Event" : activeTab === "my-event" ? "My Event" : "My Ticket"}</span>
          </p>
        </div>

        {/* Toolbar: tabs + Create button */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabSwitcher tabs={TABS} active={activeTab} onChange={setActiveTab} />

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
          >
            <Plus size={15} />
            Create New Event
          </button>
        </div>

        {/* Content */}
        {activeTab === "upcoming" && <UpcomingPanel events={UPCOMING_EVENTS} onCardClick={handleCardClick} />}
        {activeTab === "my-event" && <MyEventPanel events={MY_EVENTS} onCardClick={handleMyEventCardClick} />}
        {activeTab === "my-ticket" && <MyTicketPanel />}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { }}
      />
    </>
  );
}
