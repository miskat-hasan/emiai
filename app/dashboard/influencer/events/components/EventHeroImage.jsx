import React from "react";
import Image from "next/image";

export default function EventHeroImage({ imageUrl }) {
  return (
    <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden">
      <Image
        src={imageUrl}
        alt="Event Banner"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  );
}
