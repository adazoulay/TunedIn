import React, { useRef, memo } from "react";
import MediaPlayer from "../../components/functionality/audio/MediaPlayer";

const SpotifySong = ({ id, title, audioUrl, imgUrl, artist, externalUrl }) => {
  const mediaRef = useRef();

  console.log(externalUrl);

  return (
    <div className='spotify-song'>
      <a href={externalUrl} target='_blank' rel='noopener noreferrer' className='img-link'>
        <img src={imgUrl} alt='ALT' className='track-img' />
      </a>
      <div className='song-info'>
        <div className='title'>{title}</div>
        <div className='artist'>{artist}</div>
      </div>
      <div className='spotify-media-player'>
        <MediaPlayer mediaRef={mediaRef} isSpotify={true}>
          <audio
            ref={mediaRef}
            src={audioUrl}
            controls={false}
            id={id}
            onError={(e) => console.log(e)}
            preload='metadata'
          />
        </MediaPlayer>
      </div>
    </div>
  );
};

export default memo(SpotifySong);
