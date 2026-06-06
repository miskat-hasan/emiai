import React from "react";
import Image from "next/image";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side: Graphic Banner (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 p-6 xl:p-8">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[40px] bg-gradient-to-br from-[#FF6B00] to-[#E54500] shadow-lg">
          {/* PNG Image Wrapper */}
          <div className="relative h-[70%] w-[70%] max-w-[500px]">
            <Image
              src="/images/R-logo.png"
              alt="ReelUp Authentication Banner"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Side: Auth Content (Forms) */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 xl:p-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10">
            <Image
              src="/images/R-logo.png"
              alt="ReelUp Logo"
              fill
              size="128px"
              className="object-contain"
            />
          </div>
          <div className="relative w-10 h-10">
            <Image
              src="/images/ReelUP-logo.png"
              alt="ReelUp Logo"
              fill
              size="100%"
              className="object-contain"
            />
          </div>
        </div>
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
