import { apiSlice } from "@/redux/api/apiSlice";

export const InfluencerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = InfluencerApi;
