import React, { useEffect } from "react";
import SpotifyLogo from "../../assets/SpotifyLogo.png";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from "../Auth/authSlice";
import { setSpotifyAccessToken } from "./spotifySlice";

import "./spotify.scss";

const SpotifyAuth = () => {
  const jwtToken = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  const fetchUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3500/auth/spotify/${jwtToken}`
      : `https://melonet.onrender.com/auth/spotify`;

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accessToken = urlParams.get("access_token");
    dispatch(
      setSpotifyAccessToken({
        token: accessToken,
      })
    );
  }, []);

  return (
    <a href={fetchUrl}>
      <div className='spotify-auth-button'>
        <img src={SpotifyLogo} alt='' className='spotify-logo' />
        <div>Connect to Spotify</div>
      </div>
    </a>
  );
};

export default SpotifyAuth;
