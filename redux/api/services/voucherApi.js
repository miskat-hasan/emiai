import { apiSlice } from "../apiSlice";

export const voucherApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getVouchers: builder.query({
      query: () => ({ url: "/api/vouchers/all", method: "GET" }),
      providesTags: ["Voucher"],
    }),
    getVoucherCategories: builder.query({
      query: () => ({ url: "/api/categories", method: "GET" }),
      providesTags: ["VoucherCategory"],
    }),
    getCountries: builder.query({
      query: () => ({ url: "/api/countries", method: "GET" }),
      providesTags: ["Country"],
    }),
    createVoucher: builder.mutation({
      query: (data) => ({
        url: "/api/vouchers/store",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Voucher"],
    }),
  }),
});

export const {
  useGetVouchersQuery,
  useGetVoucherCategoriesQuery,
  useGetCountriesQuery,
  useCreateVoucherMutation,
} = voucherApi;
