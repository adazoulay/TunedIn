import React from "react";

const AuthWithSpotify = () => {
  const CLIENT_ID = "605258628eb548ee9da4e4733a90e355";
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  return (
    <div>
      <div>Auth with Spotify</div>
      <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
        SIGNUP WITH SPOTIFY
      </a>
    </div>
  );
};

export default AuthWithSpotify;
