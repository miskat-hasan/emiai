import MyEventDetailsPage from "@/components/dashboard/events/MyEventDetailsPage";

export default async function Page({ params }) {
  return <MyEventDetailsPage role="business_manager" params={params} />;
}
