import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const spotifyAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = spotifyAdapter.getInitialState();

export const spotifyApiSlice = apiSlice.injectEndpoints({
  //! QUERY
  endpoints: (builder) => ({
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.spotify.com" }),
    getPlayList: builder.query({
      query: () => "/v1/me/playlists",
      transformResponse: (responseData) => {
        const loadedSpotify = responseData.map((comment) => {
          return comment;
        });
        return spotifyAdapter.setAll(initialState, loadedSpotify);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Comment", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Comment", id })),
          ];
        } else return [{ type: "Comment", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetSpotifyQuery,
  useGetSpotifyByPostIdQuery,
  useAddNewCommentMutation,
  useDeleteCommentMutation,
} = spotifyApiSlice;
