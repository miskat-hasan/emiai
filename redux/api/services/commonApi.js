import { apiSlice } from "@/redux/api/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCountries: builder.query({
      query: () => "/countries",
      providesTags: ["Countries"],
    }),
  }),
});

export const { useGetCountriesQuery } = commonApi;
