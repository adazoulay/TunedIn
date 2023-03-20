import React from "react";

const MediaInfo = ({ metadata, contentType }) => {
  metadata = JSON.parse(metadata);
  const { title, artist, lossless, container, bitrate, sampleRate } = metadata;

  return (
    <>
      <div className='metadata-title'>Media Info</div>
      <div className='metadata-list'>
        {title && <div>title: {title} </div>}
        {artist && <div>artist: {artist} </div>}
        <div>lossless: {lossless.toString()} </div>
        {container && <div>container: {container} </div>}
        {bitrate && <div>bitrate: {Math.round(bitrate)} </div>}
        {sampleRate && <div>sample rate: {sampleRate} </div>}
      </div>
    </>
  );
};

export default MediaInfo;
