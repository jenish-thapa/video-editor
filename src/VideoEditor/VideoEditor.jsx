import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import { FaPlay, FaPause } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Observable } from "rxjs";
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
  const videoRef = useRef();

  const [cropperWidth, setCropperWidth] = useState(0);
  const [leftWidth, setLeftWidth] = useState(0);
  const [rightWidth, setRightWidth] = useState(0);
  const [prePos, setPrePos] = useState(0);

  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const preVideoRef = useRef(null);

  const [cropPos, setCropPos] = useState({
    x: 0,
    y: 0,
  });
  const videoDimensions = {
    height: 450,
    width: 800,
  };

  useEffect(() => {
    const load = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });
      // toBlobURL is used to bypass CORS issue, urls with the same
      // domain can be used directly.
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setLoaded(true);
    };

    load();
  }, []);

  // const handlePlayerReady = (player) => {
  //   const height = player.wrapper.clientHeight;
  //   setVideoHeight(height);
  //   const newWidth = (height * 16) / 9;
  //   setCropperWidth(newWidth - 6);
  // };

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
    const height = videoDimensions.height;
    // console.log(height);
    const newWidth = (height * w) / h;
    // console.log(newWidth - 6);
    setCropperWidth(newWidth - 6);
  };
  // const crop = async () => {
  //   const ffmpeg = ffmpegRef.current;
  //   const { x, y } = cropParams;
  //   console.log(cropParams);
  //   await ffmpeg.writeFile("input.mp4", await fetchFile(video));
  //   const w = width;
  //   const factorW = 320 / 842.39;
  //   console.log(factorW * w);
  //   console.log(factorW * x);
  //   await ffmpeg.exec([
  //     "-i",
  //     "input.mp4",
  //     "-vf",
  //     `crop=${w * factorW}:${180}:${x * factorW}:${y}`,
  //     "output.mp4",
  //   ]);
  //   const data = await ffmpeg.readFile("output.mp4");
  //   preVideoRef.current.src = URL.createObjectURL(
  //     new Blob([data.buffer], { type: "video/mp4" })
  //   );
  // };

  const preview = () => {};

  const handleDrag = (e, ui) => {
    const { x, y } = cropPos;
    setCropPos({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
    setLeftWidth(0.625 * x);
    setRightWidth(500 - (leftWidth + 0.625 * cropperWidth));
    setPrePos(250 - (500 - (leftWidth + rightWidth)) / 2 - leftWidth);
    console.log(x, y);
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
              />
              <Draggable
                // nodeRef={videoRef}
                bounds="parent"
                defaultPosition={{ x: 0, y: 0 }}
                onDrag={handleDrag}
              >
                <div
                  style={{
                    borderLeft: "2px solid white",
                    borderRight: "2px solid white",
                    background: "rgba(255, 255, 255, 0.1)",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                    width: cropperWidth,
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
        {loaded ? (
          <button onClick={preview}>Preview</button>
        ) : (
          <button onClick={preview} disabled>
            Preview
          </button>
        )}
      </section>
      <section className="main-right">
        <div id="pre-head">Preview</div>
        <div id="pre-body">
          <div
            style={{
              position: "relative",
              width: "500px",
              aspectRatio: "16/9",
              // transform: `translateX(${prePos}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: leftWidth,
                backgroundColor: "#37393f",
              }}
            ></div>
            <ReactPlayer
              ref={preVideoRef}
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
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "100%",
                width: rightWidth,
                backgroundColor: "#37393f",
              }}
            ></div>
          </div>
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
