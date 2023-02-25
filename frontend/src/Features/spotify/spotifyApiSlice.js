import { createEntityAdapter } from "@reduxjs/toolkit";
import { externalApiSlice } from "../../app/api/externalApiSlice";

const spotifyAdapter = createEntityAdapter({
  selectId: (spotifyEntity) => spotifyEntity.id,
  // sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = spotifyAdapter.getInitialState();

export const spotifyApiSlice = externalApiSlice.injectEndpoints({
  //! QUERY
  endpoints: (builder) => ({
    getSpotifyProfileInfo: builder.query({
      query: () => "/me",
      transformResponse: (responseData) => {
        return spotifyAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Spotify", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Spotify", id })),
          ];
        } else return [{ type: "Spotify", id: "LIST" }];
      },
    }),
    getUserTop: builder.query({
      query: (type) => `/me/top/${type}/?limit=3&time_range=short_term`,
      transformResponse: (responseData) => {
        const tracks = responseData.items;
        return spotifyAdapter.addMany(initialState, tracks);
      },
      providesTags: (result, error, arg) => {
        if (result && result?.ids) {
          return [
            { type: "Spotify", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Spotify", id })),
          ];
        } else return [{ type: "Spotify", id: "LIST" }];
      },
    }),
    getTracks: builder.query({
      query: (spotifyTrackIds) => `/tracks?ids=${spotifyTrackIds.join(",")}`,
      transformResponse: (responseData) => {
        console.log("TRACKS", responseData.tracks);
        return spotifyAdapter.setAll(initialState, responseData.tracks);
      },
      providesTags: (result, error, arg) => {
        if (result && result?.ids) {
          return [
            { type: "Spotify", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Spotify", id })),
          ];
        } else return [{ type: "Spotify", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetSpotifyProfileInfoQuery, useGetUserTopQuery, useGetTracksQuery } =
  spotifyApiSlice;
