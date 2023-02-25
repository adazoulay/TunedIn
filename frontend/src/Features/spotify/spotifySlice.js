import { createSlice } from "@reduxjs/toolkit";

const spotifySlice = createSlice({
  name: "spotifyAuth",
  initialState: { token: null, refreshToken: null },
  reducers: {
    setSpotifyAccessToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
    },
  },
});

export const { setSpotifyAccessToken } = spotifySlice.actions;
export default spotifySlice.reducer;
export const selectCurrentSpotifyToken = (state) => state.spotifyAuth.spotifyToken;
