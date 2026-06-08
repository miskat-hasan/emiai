"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bookmark, Share2, MapPin } from "lucide-react";
import EventHeroImage from "@/app/dashboard/influencer/events/components/EventHeroImage";
import EventDescription from "@/app/dashboard/influencer/events/components/EventDescription";
import EventInfoCard from "@/app/dashboard/influencer/events/components/EventInfoCard";
import EventLocation from "@/app/dashboard/influencer/events/components/EventLocation";
import EventParticipants from "@/app/dashboard/influencer/events/components/EventParticipants";

// Mock event data
const mockEventDetails = {
  1: {
    id: 1,
    title: "Digital Marketing Forum 2026",
    location: "Dhaka, Bangladesh",
    sponsor: "Events CO.",
    date: "Feb 15, 2026",
    imageUrl: "/images/demo-event-photo.png",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14608.039575440334!2d90.3654215!3d23.746476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33534720f%3A0x867375a18357731a!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1683921345678",
  },
  2: {
    id: 2,
    title: "Tech Innovators Summit",
    location: "San Francisco, CA",
    sponsor: "TechCorp",
    date: "Mar 10, 2026",
    imageUrl: "/images/demo-event-photo.png",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0955259346316!2d-122.41941592346881!3d37.77492957120312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808581b5b1111111%3A0x123456789!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1683921345678",
  },
};

export default function EventDetailsPage({ params }) {
  const { id } = params;
  const event = mockEventDetails[id] || mockEventDetails[1];
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="w-full max-w-7xl mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <a
            href="/dashboard/influencer"
            className="hover:text-orange-600 transition"
          >
            Dashboard
          </a>
          <span className="text-gray-400">/</span>
          <a
            href="/dashboard/influencer/events"
            className="hover:text-orange-600 transition"
          >
            Events
          </a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Event Details</span>
        </div>

        {/* Header with Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {event.title}
          </h1>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                isBookmarked
                  ? "bg-gradient-to-r from-[#f77721] to-[#f04f37] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
            <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
              <Share2 size={20} />
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#f77721] to-[#f04f37] hover:from-[#ea6615] hover:to-[#e33e25] text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg">
              Join The Event
            </button>
          </div>
        </div>

        {/* Hero Image Section */}
        <EventHeroImage imageUrl={event.imageUrl} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Description */}
          <div className="lg:col-span-2">
            <EventDescription />
          </div>

          {/* Right Column: Event Info Card */}
          <div className="lg:col-span-1">
            <EventInfoCard />
          </div>
        </div>

        {/* Bottom Grid: Location & Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Location Map */}
          <div className="lg:col-span-2">
            <EventLocation mapUrl={event.mapUrl} />
          </div>

          {/* Right Column: Participants */}
          <div className="lg:col-span-1">
            <EventParticipants />
          </div>
        </div>
      </div>
    </div>
  );
}
