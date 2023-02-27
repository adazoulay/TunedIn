import React, { useState, useEffect, useRef, useContext } from "react";
import { useAddViewMutation } from "../../../Features/posts/postsApiSlice";
import { useSpring, animated } from "@react-spring/web";
import { PostContext } from "../../../Features/posts/post/Post";
import useMeasure from "react-use-measure";
import { Play, Pause, Volume2, VolumeX } from "react-feather";
import "./mediaPlayer.scss";

const MediaPlayer = ({ children, mediaRef, bodyIsCollapsed = true, isSpotify = false }) => {
  const { postId, contentType } = useContext(PostContext);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewAdded, setViewAdded] = useState(false);

  const progressBarRef = useRef(null);
  const animationRef = useRef(null);

  const [addView] = useAddViewMutation();

  useEffect(() => {
    if (mediaRef?.current) {
      const handleLoadedMetadata = () => {
        const seconds = Math.floor(mediaRef?.current?.duration);
        setDuration(seconds);
        progressBarRef.current.max = seconds;
      };
      if (mediaRef?.current) {
        mediaRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      }
      return () => {
        if (mediaRef?.current) {
          mediaRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        }
      };
    }
  }, [mediaRef?.current]);

  //! PLAY/PAUSE
  const handlePlayPause = () => {
    const prevValue = playing;
    setPlaying(!prevValue);
    if (!prevValue) {
      if (!viewAdded && !isSpotify) {
        addView({ id: postId });
        setViewAdded(true);
      }
      mediaRef?.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      mediaRef?.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  //! VOLUME
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    mediaRef.current.volume = e.target.value;
  };

  const toggleVolume = () => {
    if (mediaRef) {
      if (mediaRef.current.volume) {
        setVolume(0);
        mediaRef.current.volume = 0;
      } else {
        setVolume(1);
        mediaRef.current.volume = 1;
      }
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(true);

  const [volumeRef, bounds] = useMeasure();

  const volumeSliderAnimation = useSpring({
    height: isCollapsed ? 0 : bounds.height,
    zIndex: isCollapsed ? 0 : 10,
  });

  const handleShow = (e) => {
    e.preventDefault();
    setIsCollapsed(false);
  };
  const handleHide = (e) => {
    e.preventDefault();
    setIsCollapsed(true);
  };

  //! TIME
  const whilePlaying = () => {
    progressBarRef.current.value = Math.floor(mediaRef?.current.currentTime);
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    mediaRef.current.currentTime = progressBarRef.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    if (mediaRef.current !== null) {
      progressBarRef.current.style.setProperty(
        "--seek-before-width",
        `${(mediaRef?.current.currentTime / duration) * 100}%`
      );
      setCurrentTime(mediaRef?.current.currentTime);
    }
  };

  return (
    <div className='media-player'>
      <div className='content' onClick={handlePlayPause}>
        {children}
      </div>
      <div
        className={"controls-wrapper"}
        style={{
          position:
            contentType?.startsWith("video") && !bodyIsCollapsed ? "absolute" : "static",
          gap: isSpotify ? "0em" : "0.2em",
        }}>
        <button className='controls-button' onClick={handlePlayPause}>
          {playing ? (
            <Pause size={isSpotify ? 15 : 28} color='#ebebeb' opacity={0.9} />
          ) : (
            <Play size={isSpotify ? 15 : 28} color='#ebebeb' opacity={0.9} />
          )}
        </button>
        {/* current time */}
        {!isSpotify && <div className='duration field-info'>{calculateTime(currentTime)}</div>}
        {/* progress bar */}
        <div
          className='progress-bar-wrapper'
          style={isSpotify ? { padding: "0px 0px 2px" } : {}}>
          <input
            type='range'
            className='progress-bar'
            defaultValue='0'
            ref={progressBarRef}
            onChange={changeRange}
          />
        </div>
        {/* duration */}
        {!isSpotify && (
          <div className='duration field-info'>
            {duration && !isNaN(duration) && calculateTime(duration)}
          </div>
        )}
        {/* -------- volume --------- */}
        <div className='volume' onMouseEnter={handleShow} onMouseLeave={handleHide}>
          <div className='volume-btn'>
            {mediaRef?.current?.volume ? (
              <Volume2
                size={isSpotify ? 18 : 30}
                color='#ebebeb'
                opacity={0.9}
                onClick={toggleVolume}
              />
            ) : (
              <VolumeX
                size={isSpotify ? 18 : 30}
                color='#ebebeb'
                opacity={0.9}
                onClick={toggleVolume}
              />
            )}
          </div>
          {!isCollapsed && (
            <div
              className='volume-range-wrapper'
              ref={volumeRef}
              style={isSpotify ? { transform: "translate(-5px, 32px) scale(60%)" } : {}}>
              <animated.div className='volume-range' style={volumeSliderAnimation}>
                <input
                  className='volume-bar'
                  type='range'
                  id='volume'
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{
                    accentColor: "#ebebeb",
                  }}
                />
              </animated.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
