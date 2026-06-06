import React from "react";
import Image from "next/image";

export default function EventHeroImage({ imageUrl }) {
  return (
    <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden">
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
