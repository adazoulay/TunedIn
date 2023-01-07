import React from "react";

const SoundBar = ({ mp3 }) => {
  return (
    <div className='waveform'>
      <div>SoundBar</div>
      <div>{mp3}</div>
    </div>
  );
};

export default SoundBar;
