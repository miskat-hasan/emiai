import MyEventDetailsPage from "@/components/dashboard/events/MyEventDetailsPage";

export default async function Page({ params }) {
  return <MyEventDetailsPage role="influencer" params={params} />;
}
