import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const reduxToken = getState().auth?.token;

    const cookieToken =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1]
        : null;

    const token = reduxToken || cookieToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
