import EventDetailsPage from "@/components/dashboard/events/EventDetailsPage";

export default async function Page({ params }) {
  return <EventDetailsPage role="advertiser" params={params} />;
}
