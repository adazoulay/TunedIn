import React, { memo } from "react";
import { useGetTracksQuery } from "./spotifyApiSlice";
import SpotifySong from "./SpotifySong";

import spotifyLogo from "../../assets/SpotifyLogo.png";
import "./spotify.scss";

const SpotifySpotlight = ({ spotifyId, spotifyTrackIds }) => {
  const { data, isSuccess } = useGetTracksQuery(spotifyTrackIds);

  return (
    <div className='song-spotlight'>
      <div className='spotlight-title'>Bumping right now</div>
      <div className='song-list'>
        <a
          href={`https://open.spotify.com/user/${spotifyId}`}
          target='_blank'
          rel='noopener noreferrer'
          style={{ display: "contents" }}>
          <img src={spotifyLogo} className='spotlight-logo' alt='' />
        </a>
        {isSuccess &&
          data?.ids.length &&
          data.ids.map((id) => {
            const track = data.entities[id];
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
