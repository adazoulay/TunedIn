import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAddViewMutation } from "../../../Features/posts/postsApiSlice";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import "./audioPlayer.scss";
import { Play, Pause, Volume2, VolumeX } from "react-feather";

const AudioPlayer = ({ audio, postId, children, contentRef }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewAdded, setViewAdded] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);

  const [addView] = useAddViewMutation();

  //! PLAY/PAUSE
  const handlePlayPause = () => {
    const prevValue = playing;
    setPlaying(!prevValue);
    if (!prevValue) {
      if (!viewAdded) {
        addView({ id: postId });
        setViewAdded(true);
      }
      audioRef.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    const handleLoadedMetadata = () => {
      const seconds = Math.floor(audioRef?.current?.duration);
      setDuration(seconds);
      progressBarRef.current.max = seconds;
    };
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

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
    audioRef.current.volume = e.target.value;
  };

  const toggleVolume = () => {
    if (audioRef) {
      if (audioRef.current.volume) {
        setVolume(0);
        audioRef.current.volume = 0;
      } else {
        setVolume(1);
        audioRef.current.volume = 1;
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
    progressBarRef.current.value = Math.floor(audioRef.current.currentTime);
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    if (audioRef.current !== null) {
      progressBarRef.current.style.setProperty(
        "--seek-before-width",
        `${(audioRef.current.currentTime / duration) * 100}%`
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <div className='audio-player' ref={contentRef}>
      <audio
        ref={audioRef}
        src={audio}
        crossOrigin='anonymous'
        controls={false}
        id={postId}
        // onError={(e) => console.log(e)}
        preload='metadata'
      />
      {/* SOUNDBAR */}
      <div className='soundbar' onClick={handlePlayPause} id={postId}>
        {children}
      </div>
      <div className='media-wrapper'>
        <button className='media-button' onClick={handlePlayPause}>
          {playing ? <Pause size={28} color='#ebebeb' /> : <Play size={28} color='#ebebeb' />}
        </button>

        {/* current time */}
        <div className='duration field-info'>{calculateTime(currentTime)}</div>
        {/* progress bar */}
        <div className='progress-bar-wrapper'>
          <input
            type='range'
            className='progress-bar'
            defaultValue='0'
            ref={progressBarRef}
            onChange={changeRange}
          />
        </div>
        {/* duration */}
        <div className='duration field-info'>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>
        {/* -------- volume --------- */}
        <div className='volume' onMouseEnter={handleShow} onMouseLeave={handleHide}>
          <div className='volume-btn'>
            {audioRef?.current?.volume ? (
              <Volume2 size={30} color='#ebebeb' onClick={toggleVolume} />
            ) : (
              <VolumeX size={30} color='#ebebeb' onClick={toggleVolume} />
            )}
          </div>
          {!isCollapsed && (
            <div className='volume-range-wrapper' ref={volumeRef}>
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

export default AudioPlayer;
