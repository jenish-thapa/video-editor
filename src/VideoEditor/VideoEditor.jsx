import React, { useState, useEffect, useRef } from "react";
import "./VideoEditor.css";
import ReactPlayer from "react-player";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { FaYoutube, FaPlay, FaPause } from "react-icons/fa6";
import { HiSpeakerWave } from "react-icons/hi2";

const ffmpeg = new FFmpeg();

const VideoEditor = () => {
  const [croppedVideo, setCroppedVideo] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [video, setVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [seekTime, setSeekTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const videoRef = useRef();

  useEffect(() => {
    const loadFFmpeg = async () => {
      await ffmpeg.load();
    };
    loadFFmpeg();
  }, []);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideo(URL.createObjectURL(file));
    setVideoFile(file);
    setPlaying(false); // Pause the video when a new one is uploaded
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = (e) => {
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

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const cropVideo = async () => {};

  return (
    <main className="container">
      <section className="main-left">
        <div className="video-container">
          {video ? (
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
            />
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
        </div>
        <div className="video-controls">
          <div className="crop-controls">
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
            >
              <option value="9:16">Cropper Aspect Ratio 9:16</option>
              <option value="16:9">Cropper Aspect Ratio 16:9</option>
            </select>
          </div>
        </div>
        {croppedVideo && (
          <div className="video-container">
            <h2>Cropped Video</h2>
            <video src={croppedVideo} controls className="video"></video>
          </div>
        )}
      </section>
      <section className="main-right">
        <div id="pre-head">Preview</div>
        <div id="pre-body">
          <FaYoutube id="vid-icon" />
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
