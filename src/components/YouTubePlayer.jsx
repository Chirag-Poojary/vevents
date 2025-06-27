"use client";
import React, { useState, useRef } from "react";

// Extracts video ID from various YouTube URL formats
const extractYouTubeID = (url) => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const YouTubePlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  const videoId = extractYouTubeID(videoUrl);

  const handlePlay = () => {
    setIsPlaying(true);
    // postMessage API for YouTube embed
    iframeRef.current?.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
  };

  if (!videoId) {
    return <p className="text-red-500">Invalid YouTube URL</p>;
  }

  return (
    <div className="relative w-[30vw] aspect-video group rounded-xl overflow-hidden shadow-xl">
      {/* YouTube Iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-full pointer-events-none group-hover:pointer-events-auto transition-all duration-300"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&controls=1`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Overlay play button */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/20 transition-colors duration-300 z-10"
        >
          <svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 84 84"
          >
            <circle cx="42" cy="42" r="42" fill="currentColor" opacity="0.6" />
            <polygon points="33,24 60,42 33,60" fill="white" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default YouTubePlayer;
