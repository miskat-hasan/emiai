"use client";
import { useState, useEffect } from "react";
import { getGoogleMapEmbedUrl } from "@/app/actions/mapActions";

export default function EventLocation({ mapUrl, locationName }) {
  const [embedUrl, setEmbedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(!!mapUrl);

  useEffect(() => {
    async function fetchEmbed() {
      if (!mapUrl) return;
      
      setIsLoading(true);
      // If it's already an embed URL
      if (mapUrl.includes('output=embed') || mapUrl.includes('/embed/')) {
        setEmbedUrl(mapUrl);
        setIsLoading(false);
        return;
      }
      
      // If it's a short URL or normal google maps URL, resolve it
      if (mapUrl.includes('maps.app.goo.gl') || mapUrl.includes('google.com/maps')) {
        const resolved = await getGoogleMapEmbedUrl(mapUrl);
        if (resolved) {
          setEmbedUrl(resolved);
        } else {
          //fallback to locationName or the URL itself
          const query = locationName ? encodeURIComponent(locationName) : encodeURIComponent(mapUrl);
          setEmbedUrl(`https://maps.google.com/maps?q=${query}&output=embed`);
        }
      } else {
        // Just use the URL if it's something else
        setEmbedUrl(mapUrl);
      }
      setIsLoading(false);
    }
    fetchEmbed();
  }, [mapUrl, locationName]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray/10 h-full">
      <h2 className="text-lg font-bold text-black mb-4">Event Live location</h2>
      <hr className="border-gray/20 mb-4" />
      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-gray/10">
        {isLoading ? (
           <div className="flex items-center justify-center w-full h-full text-gray animate-pulse">
             Loading Map...
           </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute top-0 left-0 w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray">
            Map URL not provided or invalid
          </div>
        )}
      </div>
    </div>
  );
}
