import Link from "next/link";
import AdDetailHero from "../components/AdDetailHero";
import AdUserBar from "../components/AdUserBar";
import AdDescription from "../components/AdDescription";
import AdInfoCard from "../components/AdInfoCard";
import AdTopRanking from "../components/AdTopRanking";
import AdActionButtons from "../components/AdActionButtons";

// Mock data — will be replaced by RTK Query (useGetAdByIdQuery) when backend is ready
const mockAds = {
  1: {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&auto=format&fit=crop&q=80",
    userName: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/150?u=janesmith",
    likes: 24,
    views: 24,
    boostLabel: "Boost Credited",
    description: [
      "Step into a night of unparalleled elegance at the Black Diamond Ball, a collaboration between Lumina Moda and renowned designer, Seraphina Dubois!",
      "Experience an evening where fashion transcends artistry, with a showcase of exclusive designs and breathtaking displays.",
      "Indulge in gourmet cuisine, captivating music, and the company of the city's most stylish elite. Secure your tickets now for a gala that promises to be the highlight of the social calendar.",
      "Don't miss the chance to be part of this extraordinary fusion of style and sophistication!",
    ],
    info: [
      { label: "Ads Create", value: "Jane Smith" },
      { label: "Prize Number", value: "03" },
      { label: "Publish Time", value: "11:59 PM" },
      { label: "Publish Date", value: "Feb 15, 2026" },
    ],
    topRankings: [
      { id: 1, name: "Jane Cooper", role: "Influencer", score: 1000, avatar: "https://i.pravatar.cc/150?u=jane" },
      { id: 2, name: "Jane Cooper", role: "Influencer", score: 900, avatar: "https://i.pravatar.cc/150?u=janec" },
      { id: 3, name: "Jenny Wilson", role: "Advertiser", score: 800, avatar: "https://i.pravatar.cc/150?u=jenny" },
      { id: 4, name: "Floyd Miles", role: "Guest", score: 700, avatar: "https://i.pravatar.cc/150?u=floyd" },
      { id: 5, name: "David Johnson", role: "Guest", score: 550, avatar: "https://i.pravatar.cc/150?u=david" },
    ],
  },
};

function getAd(id) {
  return mockAds[id] ?? { ...mockAds[1], id: Number(id) };
}

// Server Component — params is a Promise in Next.js 15+/16
export default async function AdDetailsPage({ params }) {
  const { id } = await params;
  const ad = getAd(id);

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Ads</h1>
          <p className="text-sm text-gray mt-0.5">
            <Link
              href="/dashboard/influencer"
              className="text-primary font-medium hover:underline"
            >
              Dashboard
            </Link>
            {" / "}
            <Link
              href="/dashboard/influencer/ads"
              className="text-primary font-medium hover:underline"
            >
              Ads
            </Link>
            {" / "}
            <span>Ads Details</span>
          </p>
        </div>

        {/* Action Buttons */}
        <AdActionButtons />
      </div>

      {/* Hero Image */}
      <AdDetailHero imageUrl={ad.imageUrl} alt="Ad Banner" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <AdUserBar
            userName={ad.userName}
            userAvatar={ad.userAvatar}
            likes={ad.likes}
            views={ad.views}
            boostLabel={ad.boostLabel}
          />
          
          <hr className="border-gray-200" />
          
          <AdDescription description={ad.description} />
          
          <div className="md:w-1/2">
            <AdTopRanking rankings={ad.topRankings} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <AdInfoCard items={ad.info} />
        </div>
      </div>
    </div>
  );
}
