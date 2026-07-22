import { getImageUrl } from "@/helper/getImageUrl";
import React, { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

export default function EventHeroImage({ imageUrl, alt = "Event Banner" }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-2 z-0">
          <ImageIcon size={32} className="opacity-80" />
          <span className="text-sm font-medium tracking-wide opacity-90">Loading Media...</span>
        </div>
      )}
      <Image
        src={getImageUrl(imageUrl)}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-10`}
        sizes="100vw"
        priority
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
