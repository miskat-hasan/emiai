"use client";

import React, { useState } from "react";
// Adjust this import path depending on exactly where you saved the EventCard
import EventCard from "@/app/dashboard/influencer/event/components/EventCard";
import Heading from "@/components/common/Heading";
import EventHeroImage from "@/app/dashboard/influencer/event/components/EventHeroImage";
import EventDetailsHeader from "@/app/dashboard/influencer/event/components/EventDetailsHeader";
import EventDescription from "@/app/dashboard/influencer/event/components/EventDescription";
import EventLocation from "@/app/dashboard/influencer/event/components/EventLocation";
import EventInfoCard from "@/app/dashboard/influencer/event/components/EventInfoCard";
import EventParticipants from "@/app/dashboard/influencer/event/components/EventParticipants";

// 1. Define the Mock Data
const mockEvents = [
  {
    id: 1,
    title: "Digital Marketing Forum 2025",
    location: "Virtual Zoom Link Provided upon RSVP",
    sponsor: "Event CO.",
    date: "Feb 17, 2026",
    type: "digital",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 2,
    title: "Tech Innovators Summit",
    location: "San Francisco, CA - Main Hall",
    sponsor: "TechCorp",
    date: "Mar 10, 2026",
    type: "in-person",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 3,
    title: "Content Creator Expo",
    location: "Virtual Hub",
    sponsor: "CreatorSpace",
    date: "Apr 05, 2026",
    type: "digital",
    imageUrl: "/images/demo-event-photo.png",
  },
  {
    id: 4,
    title: "Brand Mixer & Networking",
    location: "New York, NY",
    sponsor: "Media Group",
    date: "May 22, 2026",
    type: "in-person",
    imageUrl: "/images/demo-event-photo.png",
  },
];

const eventData = {
  title: "Digital Marketing Forum 2026",
  heroImage: "/images/demo-event-photo.png",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.039575440334!2d90.3654215!3d23.746476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33534720f%3A0x867375a18357731a!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1683921345678",
};
export default function EventsPage() {
  return (
    // <div className="flex flex-col gap-6 p-6 md:p-8 w-full max-w-7xl mx-auto">
    //   {/* Header Section */}
    //   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    //     <Heading level={1} className="text-2xl font-bold text-gray-900">
    //       Events
    //     </Heading>
    //   </div>

    //   {/* Grid Section for Cards */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
    //     {mockEvents.length > 0 ? (
    //       mockEvents.map((event) => (
    //         <EventCard
    //           key={event.id}
    //           title={event.title}
    //           location={event.location}
    //           sponsor={event.sponsor}
    //           date={event.date}
    //           imageUrl={event.imageUrl}
    //           buttonText="Create Invite"
    //           onButtonClick={() =>
    //             console.log(`Invite created for ${event.title}`)
    //           }
    //         />
    //       ))
    //     ) : (
    //       <div className="col-span-full py-10 text-center text-gray-500">
    //         No events found for this category.
    //       </div>
    //     )}
    //   </div>
    // </div>

    <main className="min-h-screen bg-gradient-to-b from-white to-orange-100 pb-10">
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Header Section */}
        <EventDetailsHeader title={eventData.title} />

        {/* Banner Section */}
        <EventHeroImage imageUrl={eventData.heroImage} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Description & Location */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <EventDescription />
            <EventLocation mapUrl={eventData.mapUrl} />
          </div>

          {/* Right Column: Info & Participants */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <EventInfoCard />
            {/* Participant section*/}
            <EventParticipants />
          </div>
        </div>
      </div>
    </main>
  );
}
