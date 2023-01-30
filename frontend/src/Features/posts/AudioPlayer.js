import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX } from "react-feather";
import { useAddViewMutation } from "./postsApiSlice";
import AudioSpectrumWrapper from "./AudioSpectrumWrapper";
import "./audioPlayer.scss";

const AudioPlayer = ({ audio, colors, postId }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [viewAdded, setViewAdded] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);

  const [addView] = useAddViewMutation();

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
    audioRef.current.addEventListener("loadedmetadata", () => {
      const seconds = Math.floor(audioRef.current.duration);
      setDuration(seconds);
      progressBarRef.current.max = seconds;
    });
  }, []);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

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

  return (
    <div className='audio-player'>
      <audio
        ref={audioRef}
        src={audio}
        crossOrigin='anonymous'
        controls={false}
        id={postId}
        // onError={(e) => console.log(e)}
        preload='metadata'
      />
      <div className='soundbar' onClick={handlePlayPause} id={postId}>
        {postId && (
          <AudioSpectrumWrapper
            postId={postId}
            meterColors={meterColors}
            capColor={colors[0]}
          />
        )}
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
        {/* volume */}
        <div className='volume'>
          {audioRef?.current?.volume ? (
            <Volume2 size={28} color='#ebebeb' onClick={toggleVolume} />
          ) : (
            <VolumeX size={28} color='#ebebeb' onClick={toggleVolume} />
          )}
        </div>
        <div className='volume-range'>
          <input
            className='volume-bar'
            type='range'
            id='volume'
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
