// redux/api/apiSlice.js

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithInterceptor from "@/redux/api/baseQueryWithInterceptor";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ["User", "Products", "Orders"],
  endpoints: () => ({}),
});
  