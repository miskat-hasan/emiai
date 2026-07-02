import { PublishedAdDetailsPage } from "@/components/dashboard/ads";

export default async function Page({ params }) {
  const { id } = await params;
  return <PublishedAdDetailsPage role="advertiser" adId={id} />;
}
