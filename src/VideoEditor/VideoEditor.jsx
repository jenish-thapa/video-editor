import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import "./VideoEditor.css";

const VideoEditor = () => {
  const [video, setVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [seekTime, setSeekTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [width, setWidth] = useState(0);
  const videoRef = useRef();

  const [videoHeight, setVideoHeight] = useState(0);

  // Callback for when the video player is ready
  const handlePlayerReady = (player) => {
    // Accessing the player's client dimensions
    const height = player.wrapper.clientHeight;
    setVideoHeight(height);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideo(URL.createObjectURL(file));
    setPlaying(false);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setSeekTime(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    videoRef.current.seekTo(seekTime);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setSeekTime(state.played);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  const handleAspectRatioChange = (e) => {
    const ratio = e.target.value;
    setAspectRatio(ratio);
    const [w, h] = ratio.split(":").map(Number);
    const height = videoHeight;
    console.log(height);
    const newWidth = (height * w) / h;
    console.log(newWidth-6);
    setWidth(newWidth-6);
  };

  return (
    <main className="container">
      <section className="main-left">
        <div className="video-container">
          {video ? (
            <div style={{ position: "relative" }}>
              <ReactPlayer
                ref={videoRef}
                url={video}
                playing={playing}
                controls={false}
                volume={volume}
                width="100%"
                height="100%"
                playbackRate={speed}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onReady={handlePlayerReady}
              />
              <Draggable
                // nodeRef={videoRef}
                bounds="parent"
                defaultPosition={{ x: 0, y: 0 }}
              >
                <div
                  style={{
                    borderLeft: "2px solid white",
                    borderRight: "2px solid white",
                    background: "rgba(255, 255, 255, 0.1)",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                    width: width,
                  }}
                >
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        borderTop:
                          i > 2
                            ? "1px dotted rgba(255, 255, 255, 0.5)"
                            : "none",
                        borderLeft:
                          i % 3 !== 0
                            ? "1px dotted rgba(255, 255, 255, 0.5)"
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </Draggable>
            </div>
          ) : (
            <input type="file" onChange={handleVideoUpload} />
          )}
        </div>
        <div className="video-controls-top">
          <button id="play-pause-btn" onClick={handlePlayPause}>
            {playing ? (
              <FaPause className="play-pause-icons" />
            ) : (
              <FaPlay className="play-pause-icons" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            id="seek"
            step="any"
            value={seekTime}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
        <div className="video-controls-middle">
          <div className="time-display">
            <div className="curr-time">{formatTime(seekTime * duration)}</div>
            <div className="grey" id="divider">
              |
            </div>
            <div className="grey">{formatTime(duration)}</div>
          </div>
          <div className="audio">
            <HiSpeakerWave id="audio-icon" />
            <input
              type="range"
              min={0}
              max={1}
              id="audio-inp"
              step="any"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
        <div className="video-controls-bottom">
          <div className="speed-control">
            <label htmlFor="speed-select">Playback Speed: </label>
            <select
              id="speed-select"
              value={speed}
              onChange={handleSpeedChange}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
          <div className="crop-controls">
            <label htmlFor="aspect-ratio-select">Aspect Ratio: </label>
            <select
              id="aspect-ratio-select"
              value={aspectRatio}
              onChange={handleAspectRatioChange}
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
            </select>
          </div>
        </div>
      </section>
      <section className="main-right">
        <div id="pre-head">Preview</div>
        <div id="pre-body">
          <p id="pre-message">Preview not available</p>
          <p>
            Please click on "Start Cropper"
            <br />
            and then play video
          </p>
        </div>
      </section>
    </main>
  );
};

export default VideoEditor;
