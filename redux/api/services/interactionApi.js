import { apiSlice } from "../apiSlice";

export const interactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    storeInteraction: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          formData.append(key, value);
        });

        return {
          url: "api/interactions/store",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, body) => {
        if (body.interaction_type !== 'view') {
          return ["Ad", "Contest", "Event"];
        }
        return [];
      },
    }),
  }),
});

export const { useStoreInteractionMutation } = interactionApi;
