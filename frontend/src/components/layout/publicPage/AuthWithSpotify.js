import { useEffect } from "react";
import SpotifyLogo from "../../../assets/SpotifyLogo.png";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from "../../../Features/Auth/authSlice";
import { setSpotifyAccessToken } from "../../../Features/spotify/spotifySlice";
import "../../../Features/spotify/spotify.scss";

const AuthWithSpotify = () => {
  const dispatch = useDispatch();

  const fetchUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3500/auth/authWithSpotify`
      : `https://melonet.onrender.com/auth/authWithSpotify`;

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
        <div>Connect with Spotify</div>
      </div>
    </a>
  );
};

export default AuthWithSpotify;
