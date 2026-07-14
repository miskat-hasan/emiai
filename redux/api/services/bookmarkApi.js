import { apiSlice } from "../apiSlice";

export const bookmarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query({
      query: (type) => ({
        url: `/api/bookmarks?type=${type}`,
        method: "GET",
      }),
      providesTags: ["Bookmark"],
    }),
    toggleBookmark: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          formData.append(key, value);
        });

        return {
          url: "/api/bookmarks/toggle",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Bookmark", "Ad", "Contest", "Event", "Portfolio"],
    }),
  }),
});

export const { useToggleBookmarkMutation, useGetBookmarksQuery } = bookmarkApi;
