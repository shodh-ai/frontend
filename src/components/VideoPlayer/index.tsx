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
      Hi
    </div>
  );
};

export default VideoPlayer;