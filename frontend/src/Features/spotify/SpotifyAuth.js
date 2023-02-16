import React, { useEffect } from "react";
import { useConnectToSpotifyMutation } from "../Auth/authApiSlice";
import SpotifyLogo from "../../assets/SpotifyLogo.png";

const SpotifyAuth = ({ userId }) => {
  const [connectToSpotify] = useConnectToSpotifyMutation();

  const handleLogin = () => {
    console.log("click");
    connectToSpotify();
  };

  return (
    <div className='spotify-auth-button' onClick={handleLogin}>
      <img src={SpotifyLogo} alt='' className='spotify-logo' />
      <div>Connect to Spotify</div>
    </div>
  );
};

export default SpotifyAuth;
