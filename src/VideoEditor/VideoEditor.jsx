import React, { useState, useEffect, useRef } from "react";
import "./VideoEditor.css";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { FaYoutube } from "react-icons/fa6";

const ffmpeg = new FFmpeg();

const VideoEditor = () => {
  const [video, setVideo] = useState(null);
  const [croppedVideo, setCroppedVideo] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const videoRef = useRef();
  const [videoFile, setVideoFile] = useState(null);

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
  };

  const cropVideo = async () => {};

  return (
    <main className="container">
      <section className="main-left">
        <div className="video-container">
          {video ? (
            <>
              <video
                ref={videoRef}
                src={video}
                controls
                className="video"
              ></video>
              <div className="crop-grid"></div>
            </>
          ) : (
            <input type="file" onChange={handleVideoUpload} />
          )}
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
          <FaYoutube id="vid-icon"/>
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
