import React, { useMemo, useState, useRef, useEffect, memo } from "react";
import AudioPlayer from "../../../components/functionality/audio/AudioPlayer";
import AudioSpectrumWrapper from "../../../components/functionality/audio/AudioSpectrumWrapper";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

import { useDispatch } from "react-redux";
import { setPlayerInfo } from "../../../components/functionality/audio/playerReducer";

import { ChevronsUp, ChevronsRight } from "react-feather";

const PostBody = ({ audioUrl, colors, postId, title, userData }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  //! COLORS
  const createMeterColors = (colors) => {
    if (colors.length < 2) {
      return [
        { stop: 0, color: "#f00" },
        { stop: 0.5, color: "#0CD7FD" },
        { stop: 1, color: "red" },
      ];
    }
    return colors.map((color, index) => {
      return { stop: index / (colors.length - 1), color: color };
    });
  };

  const meterColors = useMemo(() => createMeterColors(colors), [colors]);

  //! ANIMATION

  const [ref, bounds] = useMeasure();

  const toggleWrapperAnimatedStyle = useSpring({
    transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
  });
  const panelContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : bounds.height,
    config: {
      mass: 0.05,
    },
  });

  const togglePanel = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const dispatch = useDispatch();

  const activateFooter = () => {
    dispatch(
      setPlayerInfo({
        audioUrl,
        userImg: userData.imageUrl,
        username: userData.username,
        userId: userData._id,
        title,
      })
    );
  };

  return (
    <div className='body-wrapper'>
      <div>
        <div className='soundbar-media'>
          <animated.div
            className='toggle-soundbar'
            style={toggleWrapperAnimatedStyle}
            onClick={togglePanel}>
            {<ChevronsUp />}
          </animated.div>
          <div className='activate-footer' onClick={activateFooter}>
            <ChevronsRight />
          </div>
        </div>

        {audioUrl && colors && (
          <AudioPlayer audio={audioUrl} colors={colors} postId={postId} contentRef={ref}>
            <animated.div className='soundbar-wrapper' style={panelContentAnimatedStyle}>
              <AudioSpectrumWrapper
                postId={postId}
                meterColors={meterColors}
                capColor={colors[0]}
                isCollapsed={isCollapsed}
              />
            </animated.div>
          </AudioPlayer>
        )}
      </div>
    </div>
  );
};

export default memo(PostBody);
