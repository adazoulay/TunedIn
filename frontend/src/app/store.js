import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { externalApiSlice } from "./api/externalApiSlice";
import authReducer from "../Features/Auth/authSlice";
import spotifyReducer from "../Features/spotify/spotifySlice";
import playerReducer from "../components/functionality/audio/playerReducer";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [externalApiSlice.reducerPath]: externalApiSlice.reducer, //! Doesnt work for some reason
    auth: authReducer,
    spotifyAuth: spotifyReducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, externalApiSlice.middleware),
  //DEV
  devTools: process.env.NODE_ENV === "development" ? true : false,
});
