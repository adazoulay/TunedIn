import React, { memo, useEffect, useState } from "react";

import AudioSpectrum from "react-audio-spectrum";

//! UseIntersection Observer
const AudioSpectrumWrapper = ({ postId, meterColors, capColor, isCollapsed }) => {
  const [meterCount, setMeterCount] = useState(512);

  useEffect(() => {
    if (isCollapsed) {
      setTimeout(() => {
        setMeterCount(0);
      }, 500);
    } else {
      setMeterCount(512);
    }
  }, [isCollapsed]);

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
        meterCount={meterCount}
        // meterCount={isCollapsed ? 0 : 512}
        meterColor={meterColors}
        gap={4}
      />
    </>
  );
};

export default memo(AudioSpectrumWrapper);
