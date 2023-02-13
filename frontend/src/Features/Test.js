// import React, { Component } from 'react';
// import './AudioSpectrum.css';

// class AudioSpectrum extends Component {
//   canvas = React.createRef();

//   componentDidMount() {
//     this.draw();
//   }

//   componentDidUpdate() {
//     this.draw();
//   }

//   draw = () => {
//     const { src } = this.props;
//     const canvas = this.canvas.current;
//     const canvasCtx = canvas.getContext('2d');
//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const analyser = audioCtx.createAnalyser();
//     const audio = new Audio();
//     audio.src = src;
//     audio.crossOrigin = 'anonymous';
//     const audioSrc = audioCtx.createMediaElementSource(audio);
//     audioSrc.connect(analyser);
//     analyser.connect(audioCtx.destination);

//     const width = canvas.width;
//     const height = canvas.height;
//     const barWidth = 2;
//     const barSpacing = 1;
//     const barCount = (width / (barWidth + barSpacing));
//     const freqData = new Uint8Array(analyser.frequencyBinCount);

//     function renderFrame() {
//       requestAnimationFrame(renderFrame);
//       analyser.getByteFrequencyData(freqData);

//       canvasCtx.clearRect(0, 0, width, height);

//       for (let i = 0; i < barCount; i++) {
//         const barHeight = freqData[i];
//         canvasCtx.fillStyle = 'rgb(255, 165, 0)';
//         canvasCtx.fillRect(i * (barWidth + barSpacing), height - barHeight, barWidth, barHeight);
//       }
//     }
//     audio.play();
//     renderFrame();
//   };

//   render() {
//     return (
//       <canvas className="audio-spectrum" ref={this.canvas} />
//     );
//   }
// }

// AudioSpectrum.propTypes = {
//   src: PropTypes.string.isRequired,
// };

// export default AudioSpectrum;
