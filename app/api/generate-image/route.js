import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  );

  const data = await res.json();
  const imageUrl = data?.results?.[0]?.urls?.regular || null;

  return NextResponse.json({ imageUrl });
}
