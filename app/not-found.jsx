"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen text-2xl">
      Not Found
      <button onClick={() => router.back()} className="bg-primary border border-secondary px-3 py-2 text-sm rounded-md cursor-pointer">Go Back</button>
    </div>
  );
};

export default Page;
