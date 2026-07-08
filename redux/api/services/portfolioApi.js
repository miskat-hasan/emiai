import { apiSlice } from "../apiSlice";

const portfolioApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPortfolios: builder.query({
      query: () => ({
        url: "/api/portfolios/my-portfolio",
        method: "GET",
      }),
    }),

    getInfluencerPortfolios: builder.query({
      query: () => ({
        url: "/api/portfolios?role=influencer",
        method: "GET",
      }),
    }),

    getMyClients: builder.query({
      query: () => ({
        url: "/api/portfolios/my-clients",
        method: "GET",
      }),
    }),

    getSinglePortfolio: builder.query({
      query: (portfolioId) => ({
        url: `/api/portfolios/show?portfolio_id=${portfolioId}`,
        method: "GET",
      }),
    }),

    postPortfolio: builder.mutation({
      query: (data) => {
        const fd = new FormData();
        fd.append("user_id", data.user_id);
        fd.append("title", data.title);
        fd.append("description", data.description);

        data.mediaFiles.forEach((item, index) => {
          fd.append(`media[${index}][media_type]`, item.media_type);
          fd.append(`media[${index}][title]`, item.title);
          fd.append(`media[${index}][file]`, item.file);
        });

        return {
          url: "/api/portfolios/store",
          method: "POST",
          body: fd,
        };
      },
    }),

    updatePortfolio: builder.mutation({
      query: (data) => {
        const fd = new FormData();
        fd.append("id", data.id);
        fd.append("title", data.title);
        fd.append("description", data.description);

        if (data.user_id) {
          fd.append("user_id", data.user_id);
        }

        (data.mediaFiles || []).forEach((item, index) => {
          fd.append(`media[${index}][media_type]`, item.media_type);
          fd.append(`media[${index}][title]`, item.title);
          fd.append(`media[${index}][file]`, item.file);
        });

        return {
          url: "/api/portfolios/update",
          method: "POST",
          body: fd,
        };
      },
    }),
  }),
});

export const {
  useGetPortfoliosQuery,
  useGetInfluencerPortfoliosQuery,
  useGetMyClientsQuery,
  useGetSinglePortfolioQuery,
  usePostPortfolioMutation,
  useUpdatePortfolioMutation,
} = portfolioApi;
