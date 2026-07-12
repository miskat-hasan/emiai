import { getImageUrl } from "@/helper/getImageUrl";
import React from "react";
import Image from "next/image";

export default function EventHeroImage({ imageUrl, alt = "Event Banner" }) {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
      <Image
        src={getImageUrl(imageUrl)}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  );
}
