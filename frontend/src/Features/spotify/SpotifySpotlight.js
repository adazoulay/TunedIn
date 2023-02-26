import React, { memo } from "react";
import { useGetTracksQuery } from "./spotifyApiSlice";
import SpotifySong from "./SpotifySong";
import useAuth from "../../hooks/useAuth";

import spotifyLogo from "../../assets/SpotifyLogo.png";
import "./spotify.scss";

const SpotifySpotlight = ({ spotifyTrackIds }) => {
  const { data, isSuccess } = useGetTracksQuery(spotifyTrackIds);

  console.log("spotifyTrackIds", spotifyTrackIds);

  return (
    <div className='song-spotlight'>
      <div className='spotlight-title'>Bumping right now</div>
      <div className='song-list'>
        <img src={spotifyLogo} className='spotlight-logo' alt='' />
        {isSuccess &&
          data?.ids.length &&
          data.ids.map((id) => {
            const track = data.entities[id];
            console.log(track);
            return (
              <SpotifySong
                key={id}
                id={id}
                imgUrl={track.album.images[2].url}
                title={track.name}
                artist={track.artists[0].name}
                audioUrl={track.preview_url}
                externalUrl={track?.external_urls.spotify}
                // audioUrl={spotifyId ? track.href : track.previewUrl}
              />
            );
          })}
      </div>
    </div>
  );
};

export default memo(SpotifySpotlight);
