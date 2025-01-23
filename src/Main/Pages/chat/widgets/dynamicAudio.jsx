import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faPlay,
  faPause,
  faForward,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./dynamicAudio.css";
import { ApiEndPoint, formatTimestamp, splitSenderName } from "../../Component/utils/utlis";
import "./dynamicAudio.css";
import styles from "./dynamicDocument.module.css";
import RenderStatusIcon from "../widgets/renderMessageStatus";
const DynamicAudio = ({
  fileId,
  position,
  timestamp,
  avatar,
  senderName,
  color_code,
  status,
  type,
  blockScroll,
  unblockScroll,
}) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudioDetails = async () => {
      try {
        const detailsResponse = await fetch(
          `${ApiEndPoint}/fileDetails/${fileId}`
        );
        if (!detailsResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const { filename, filetype } = await detailsResponse.json();
        setFileName(filename);
        setMimeType(filetype);

        const url = `${ApiEndPoint}/downloadFile/${fileId}`;
        setAudioUrl(url);
        if (audioRef.current) {
          audioRef.current.src = url;
        }
      } catch (error) {
        console.error("Error fetching the audio:", error);
      }
    };

    fetchAudioDetails();

    // Cleanup URL object when component unmounts
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [fileId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = () => setIsPlaying(false);
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onloadedmetadata = () => setDuration(audio.duration);
    }
  }, [audioRef]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const handleBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime -= 5; // Go back 5 seconds
    }
  };

  const handleForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime += 5; // Go forward 5 seconds
    }
  };

  const handleDownload = () => {
    const anchor = document.createElement("a");
    anchor.href = audioUrl;
    anchor.download = fileName;
    anchor.click();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`${styles["chat-message-" + position]} ${styles["chat-message"]}`}>
      <div className={styles[`avatar-${position} pl-3`]}>
        <div
          className="rounded-circle d-flex justify-content-center align-items-center"
        />
        <img
          alt="User"
          src={avatar ? avatar : "https://bootdey.com/img/Content/avatar/avatar1.png"}
          className="rounded-circle"
          width={30}
          height={30}
          title={senderName}
          style={{ marginLeft: "15px" }}
        />
        <div className="text-center text-wrap sender-name">
          {splitSenderName(senderName)}
          <br />
          {formatTimestamp(timestamp)}
        </div>
      </div>
      <div className="audio-container px-1 position-relative"> {/* Add position-relative here */}
        <audio
          ref={audioRef}
          className="audio py-2"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        />
        <div className="progress-container mt-1">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="controls mt-3">
          <button onClick={handleBackward}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button onClick={togglePlay}>
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </button>
          <button onClick={handleForward}>
            <FontAwesomeIcon icon={faForward} />
          </button>
          <button onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
        <div>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        {status && (
          <div style={{
            marginBottom: "10px", // adjust this based on how far you want the icon from the top
            marginLeft: "90%",
          }}> {/* Adjust top positioning */}


            <RenderStatusIcon
              status={status}
              message={null}
              id={fileId}
              type={type}
              blockScroll={blockScroll}
              unblockScroll={unblockScroll}
            />
            {/* {RenderStatusIcon({
              status:status,
              message:null,
              id:fileId,
              type:type
            })} */}
          </div>
        )}
      </div>
    </div>
  );

};

DynamicAudio.propTypes = {
  fileId: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["left", "right"]).isRequired,
  timestamp: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  senderName: PropTypes.string,
  color_code: PropTypes.string,
};

DynamicAudio.propTypes = {
  fileId: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["left", "right"]).isRequired,
  timestamp: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  senderName: PropTypes.string,
  color_code: PropTypes.string,
};

export default DynamicAudio;



