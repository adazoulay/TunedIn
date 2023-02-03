import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
  name: "player",
  initialState: { playerInfo: null },
  reducers: {
    setPlayerInfo: (state, action) => {
      state.playerInfo = action.payload;
    },
    clearPlayerInfo: (state, action) => {
      state.playerInfo = null;
    },
  },
});

export const { setPlayerInfo, clearPlayerInfo } = playerSlice.actions;
export default playerSlice.reducer;
export const selectPlayerInfo = (state) => state.player.playerInfo;
