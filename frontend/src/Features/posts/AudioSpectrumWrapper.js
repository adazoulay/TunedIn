import React, { memo, useEffect } from "react";

import AudioSpectrum from "react-audio-spectrum";

const AudioSpectrumWrapper = ({ postId, meterColors, capColor }) => {
  return (
    <>
      <AudioSpectrum
        // id='audio-canvas'
        height={150}
        width={600}
        audioId={postId}
        capColor={capColor}
        capHeight={2}
        meterWidth={2}
        meterCount={512}
        meterColor={meterColors}
        gap={4}
      />
    </>
  );
};

export default memo(AudioSpectrumWrapper);
