'use client'
import { RefObject } from 'react';

interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  isVideoPlaying: boolean;
  handleVideoToggle: () => void;
  subtitles: string;
  onVideoEnd?: () => void;
}

const VideoPlayer = ({ videoRef, handleVideoToggle, subtitles, onVideoEnd }: VideoPlayerProps) => {
  return (
    <div className='absolute inset-0 bottom-20 z-20'>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="/videoplayback.mp4"
        preload="metadata"
        onClick={handleVideoToggle}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }
          handleVideoToggle();
          onVideoEnd?.();
        }}
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Subtitles */}
      {subtitles && (
        <div className="absolute bottom-16 left-0 right-0 text-center">
          <div className="inline-block bg-black/70 px-4 py-2 rounded text-white">
            {subtitles}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;