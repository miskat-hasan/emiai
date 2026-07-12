import { getImageUrl } from "@/helper/getImageUrl";
import React from "react";
import Image from "next/image";

export default function AdDetailHero({ imageUrl, mediaType, alt = "Ad Banner" }) {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
      {mediaType === "video" || imageUrl?.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) ? (
        <video
          src={imageUrl}
          controls
          autoPlay
          muted
          className="w-full h-full object-cover bg-black"
        />
      ) : (
        <Image
          src={getImageUrl(imageUrl)}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      )}
    </div>
  );
}
