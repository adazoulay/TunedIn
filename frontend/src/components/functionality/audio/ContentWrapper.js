import React, { memo, useEffect, useState, useMemo, useContext } from "react";

import { PostContext } from "../../../Features/posts/post/Post";

import AudioSpectrum from "react-audio-spectrum";

//! UseIntersection Observer
const ContentWrapper = ({ mediaRef, sizeRef, isCollapsed }) => {
  const { postId, contentUrl, contentType, colors } = useContext(PostContext);

  const [meterCount, setMeterCount] = useState(512);

  useEffect(() => {
    if (isCollapsed) {
      setTimeout(() => {
        setMeterCount(0);
      }, 500);
    } else {
      setMeterCount(300);
    }
  }, [isCollapsed]);

  const createMeterColors = (colors) => {
    if (!colors || colors?.length < 2) {
      return [
        { stop: 0, color: "#f00" },
        { stop: 0.5, color: "#990cfd" },
        { stop: 1, color: "red" },
      ];
    }
    return colors.map((color, index) => {
      return { stop: index / (colors.length - 1), color: color };
    });
  };

  const meterColors = useMemo(() => createMeterColors(colors), [colors]);

  if (contentType && contentType.startsWith("audio")) {
    return (
      <div ref={sizeRef}>
        <audio
          ref={mediaRef}
          src={contentUrl}
          crossOrigin='anonymous'
          controls={false}
          id={postId}
          // onError={(e) => console.log(e)}
          preload='metadata'
        />
        <div className='soundbar'>
          <AudioSpectrum
            height={170}
            width={600}
            audioId={postId}
            capColor={colors?.length ? colors[0] : "red"}
            capHeight={2}
            meterWidth={2}
            meterCount={meterCount}
            meterColor={meterColors}
            gap={4}
          />
        </div>
      </div>
    );
  } else if (contentType && contentType.startsWith("video")) {
    return (
      <div className='video-wrapper' ref={sizeRef}>
        <video
          ref={mediaRef}
          src={contentUrl}
          crossOrigin='anonymous'
          controls={false}
          id={postId}
          // onError={(e) => console.log(e)}
          style={{ display: isCollapsed ? "none" : "flex" }}
          preload='metadata'
        />
      </div>
    );
  }

  return <></>;
};

export default memo(ContentWrapper);
