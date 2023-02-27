import React, { useEffect } from "react";
import SpotifyLogo from "../../assets/SpotifyLogo.png";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from "../Auth/authSlice";
import { setSpotifyAccessToken } from "./spotifySlice";
import { setCredentials } from "../Auth/authSlice";

import "./spotify.scss";

const SpotifyAuth = () => {
  const jwtToken = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  const fetchUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3500/auth/spotify/${jwtToken}`
      : `https://melonet.onrender.com/auth/spotify/${jwtToken}`;

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const access_token = urlParams.get("access_token");
    const accessToken = urlParams.get("accessToken");
    dispatch(
      setSpotifyAccessToken({
        token: access_token,
      }),
      setCredentials({
        accessToken,
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
