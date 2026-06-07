"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "@/app/dashboard/influencer/events/components/EventCard";

// Mock Events Data
const mockEvents = [
  // Upcoming Events
  {
    id: 1,
    title: "Digital Marketing Forum 2025",
    location: "Hello this is about my portfolio",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    category: "upcoming",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 2,
    title: "Digital Marketing Forum 2025",
    location: "Hello this is about my portfolio",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    category: "upcoming",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 3,
    title: "Digital Marketing Forum 2025",
    location: "Hello this is about my portfolio",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    category: "upcoming",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 4,
    title: "Digital Marketing Forum 2025",
    location: "Hello this is about my portfolio",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    category: "upcoming",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 5,
    title: "Digital Marketing Forum 2025",
    location: "Hello this is about my portfolio",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    category: "upcoming",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 6,
    title: "Digital Marketing Forum 2025",
    location: "Hello this is about my portfolio",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    category: "upcoming",
    imageUrl: "/images/demo-event-photo.png",
  },
  // My Events
  {
    id: 7,
    title: "Tech Innovators Summit",
    location: "San Francisco, CA",
    sponsor: "TechCorp",
    date: "Mar 10, 2026",
    category: "my-event",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 8,
    title: "Content Creator Expo",
    location: "Los Angeles, CA",
    sponsor: "CreatorSpace",
    date: "Apr 05, 2026",
    category: "my-event",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 9,
    title: "Brand Influencer Meetup",
    location: "New York, NY",
    sponsor: "BrandHub",
    date: "May 12, 2026",
    category: "my-event",
    imageUrl: "/images/demo-event-photo.png",
  },
  // My Tickets
  {
    id: 10,
    title: "Social Media Masterclass",
    location: "Miami, FL",
    sponsor: "MediaPro",
    date: "Mar 20, 2026",
    category: "my-ticket",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 11,
    title: "Influencer Bootcamp 2026",
    location: "Austin, TX",
    sponsor: "InfluenceHub",
    date: "Apr 15, 2026",
    category: "my-ticket",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 12,
    title: "Digital Strategy Conference",
    location: "Chicago, IL",
    sponsor: "StrategyWorks",
    date: "May 25, 2026",
    category: "my-ticket",
    imageUrl: "/images/demo-event-photo.png",
  },
];

// Filter options
const filterOptions = [
  { id: "upcoming", label: "Upcoming Event", value: "upcoming" },
  { id: "my-event", label: "My Event", value: "my-event" },
  { id: "my-ticket", label: "My Ticket", value: "my-ticket" },
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const router = useRouter();

  // Filter events based on active category
  const filteredEvents = mockEvents.filter(
    (event) => event.category === activeFilter,
  );

  const handleDetailsClick = (eventId) => {
    router.push(`/dashboard/influencer/events/${eventId}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <a
          href="/dashboard/influencer"
          className="hover:text-orange-600 transition"
        >
          Dashboard
        </a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Events</span>
      </div>

      {/* Header Section with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>

        {/* Create New Event Button */}
        <button className="px-6 py-2.5 bg-gradient-to-r from-[#f77721] to-[#f04f37] hover:from-[#ea6615] hover:to-[#e33e25] text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg">
          Create New Event
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.value)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeFilter === option.value
                ? "bg-gradient-to-r from-[#f77721] to-[#f04f37] text-white shadow-md hover:shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              imageUrl={event.imageUrl}
              title={event.title}
              location={event.location}
              sponsor={event.sponsor}
              date={event.date}
              buttonText="Create Invite"
              onButtonClick={() => handleDetailsClick(event.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <p className="text-gray-500 text-lg font-medium">
              No events found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
