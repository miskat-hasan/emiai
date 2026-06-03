import { apiSlice } from "@/redux/api/apiSlice";

export const AdvertiserApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = AdvertiserApi;
