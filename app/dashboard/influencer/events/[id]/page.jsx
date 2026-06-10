import Link from "next/link";
import EventHeroImage from "../components/EventHeroImage";
import EventDescription from "../components/EventDescription";
import EventInfoCard from "../components/EventInfoCard";
import EventLocation from "../components/EventLocation";
import EventParticipants from "../components/EventParticipants";
import MyEventActionButtons from "../components/MyEventActionButtons";

// Mock event data — will be replaced by RTK Query when backend is ready
const mockEventDetails = {
  1: {
    id: 1,
    title: "Digital Marketing Forum 2026",
    location: "Dhaka, Bangladesh",
    sponsor: "Events CO.",
    date: "Feb 15, 2026",
    eventType: "Offline",
    participants: 213,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.039575440334!2d90.3654215!3d23.746476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33534720f%3A0x867375a18357731a!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1683921345678",
  },
};

// Fallback: any unknown id gets event 1's data
function getEvent(id) {
  return mockEventDetails[id] ?? { ...mockEventDetails[1], id: Number(id) };
}

// Server Component 
export default async function EventDetailsPage({ params }) {
  const { id } = await params;
  const event = getEvent(id);

  const infoItems = [
    { label: "Event Type", value: event.eventType || "Offline" },
    { label: "Participants", value: String(event.participants || 213) },
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
            href="/dashboard/influencer"
            className="text-primary font-medium hover:underline"
          >
            Dashboard
          </Link>
          {" / "}
          <Link
            href="/dashboard/influencer/events"
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
        <MyEventActionButtons />
      </div>

      {/* Hero Image */}
      <EventHeroImage imageUrl={event.imageUrl} alt={event.title} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <EventDescription title={event.title} />
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
          <EventParticipants />
        </div>
      </div>
    </div>
  );
}
