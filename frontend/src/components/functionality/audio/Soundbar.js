import React, { useState, useRef, useEffect } from "react";
import { set } from "date-fns";

const Soundbar = ({ audioRef, handlePlayPause }) => {
  const canvasRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [audioCtx, setAudioCtx] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [bufferLength, setBufferLength] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      setCtx(context);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (audioRef) {
      audioRef.current.crossOrigin = "anonymous";
      setAudio(audioRef.current);
    }
  }, [audioRef]);

  useEffect(() => {
    if (audioCtx && audio) {
      if (!audioSource) {
        const audiosource = audioCtx.createMediaElementSource(audio);
        setAudioSource(audiosource);
      }
      if (!analyser) {
        const analyserinit = audioCtx.createAnalyser();
        analyserinit.connect(audioCtx.destination);
        analyserinit.fftSize = 64;
        setAnalyser(analyserinit);
        const bufferLength = analyserinit.frequencyBinCount;
        setBufferLength(bufferLength);
        const dataarray = new Uint8Array(bufferLength);
        setDataArray(dataarray);
      }
    }
    return () => {
      // Cleanup function
      if (audioSource) {
        audioSource.disconnect();
      }
      if (analyser) {
        analyser.disconnect();
      }
    };
  }, [analyser]);

  useEffect(() => {
    if (analyser && dataArray) {
      animate();
    }
  }, [dataArray]);

  const doThings = () => {
    //! setState to only the problem one, useEffect for others
    handlePlayPause();
    if (!audioCtx) {
      const audioctx = new AudioContext();
      setAudioCtx(audioctx);
    }
  };

  const canvasHeight = 150;
  const canvasWidth = 150;
  const barWidth = canvasWidth / bufferLength;
  let barHeight;
  let x;

  function animate() {
    x = 0;

    if (analyser !== undefined && dataArray) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      analyser.getFrequencyData(dataArray);
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = "white";
        ctx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
        x += barWidth;
      }
      requestAnimationFrame(animate);
    }
  }

  const renders = useRef(0);

  return (
    <div className='container' onClick={doThings}>
      <div>renders: {renders.current++}</div>
      <canvas ref={canvasRef} width='700'></canvas>
    </div>
  );
};

export default Soundbar;
