import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setSpotifyAccessToken } from "../../Features/spotify/spotifySlice";
import { baseQuery as internalBaseQuery } from "./apiSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.spotify.com/v1",
  credentials: "same-origin",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().spotifyAuth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    const refreshResult = await internalBaseQuery("/auth/spotifyRefresh", api, extraOptions);
    if (refreshResult?.data) {
      api.dispatch(setSpotifyAccessToken({ token: refreshResult.data.access_token }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403 || refreshResult?.error?.status === 401) {
        const refreshResult = await internalBaseQuery(
          "/auth/spotifyTempAuth",
          api,
          extraOptions
        );
        console.log("IN SHITTY AUTH SPOTIFY");
        console.log("REFRESHED RESULT", refreshResult);

        api.dispatch(setSpotifyAccessToken({ token: refreshResult.data.access_token }));
        result = await baseQuery(args, api, extraOptions);

        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }
  return result;
};

export const externalApiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "apiSpotify",
  tagTypes: ["Spotify"],
  endpoints: (builder) => ({}),
});
