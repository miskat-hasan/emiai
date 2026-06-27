import AdDetailsPage from "@/components/dashboard/ads/AdDetailsPage";

export default async function Page({ params }) {
  return (
    <AdDetailsPage 
      role="guest" 
      params={params} 
      parentPath="/dashboard/guest/explore" 
      parentName="Explore" 
    />
  );
}
