import { apiSlice } from "@/redux/api/apiSlice";

export const dealApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDeals: builder.query({
      query: ({ page, status, search }) => ({
        method: "GET",
        url: `/api/deals`,
        params: {
          page,
          status,
          search,
          per_page: 9,
        },
      }),
      providesTags: ["Deals"],
    }),
    getDealDetails: builder.query({
      query: id => ({
        method: "GET",
        url: `/api/deals/show?id=${id}`,
      }),
      providesTags: ["Deals"],
    }),
    createDeal: builder.mutation({
      query: data => ({
        method: "POST",
        url: "/api/deals/store",
        body: data,
      }),
      invalidatesTags: ["Deals"],
    }),
    updateDealStatus: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("status", data.status);
        if (data.message) {
          formData.append("message", data.message);
        }
        if (data.file) {
          formData.append("file", data.file);
        }
        
        return {
          method: "POST",
          url: "/api/deals/update-status",
          body: formData,
        };
      },
      invalidatesTags: ["Deals"],
    }),
    submitDelivery: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("deal_id", data.deal_id);
        formData.append("delivery_message", data.delivery_message);
        if (data.file) {
          formData.append("file", data.file);
        }
        
        return {
          method: "POST",
          url: "/api/deals/submit-delivery",
          body: formData,
        };
      },
      invalidatesTags: ["Deals"],
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealDetailsQuery,
  useCreateDealMutation,
  useUpdateDealStatusMutation,
  useSubmitDeliveryMutation,
} = dealApi;
