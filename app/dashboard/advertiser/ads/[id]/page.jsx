import AdDetailsPage from "@/components/dashboard/ads/AdDetailsPage";

export default async function Page({ params }) {
  return <AdDetailsPage role="advertiser" params={params} />;
}
