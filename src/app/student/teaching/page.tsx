'use client'
import React, { useState, useRef, useEffect } from 'react'
import ChatOverlay from "../../../components/Overlay/ChatOverlay"
import VideoPlayer from "../../../components/VideoPlayer"
import NotesSection from '../../../components/NotesSection'
import AudioControl from '../../../components/AudioControl'
import ControlBar from '../../../components/ControlBar'
import { FileModal, ErrorModal, CompletionModal } from '../../../components/Modal'
import Image from 'next/image'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  [index: number]: {
    transcript: string;
    confidence: number;
  };
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognitionInstance;
    };
  }
}

const Teaching = () => {
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [isNotesEnabled, setIsNotesEnabled] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [subtitles, setSubtitles] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const userRecognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const subtitleRecognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const isSubtitlesEnabled = useRef(false)

  // Video subtitles speech recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const latestResult = event.results[event.results.length - 1];
      if (latestResult) {
        const transcript = latestResult[0]?.transcript || '';
        setSubtitles(transcript);
      }
    };

    recognition.onend = () => {
      // Restart subtitles recognition if video is still playing
      if (videoRef.current && !videoRef.current.paused && isSubtitlesEnabled.current) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Subtitles recognition restart error:', error);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Subtitles recognition error:', event.error);
    };

    subtitleRecognitionRef.current = recognition;

    return () => {
      if (subtitleRecognitionRef.current) {
        try {
          subtitleRecognitionRef.current.stop();
        } catch (error) {
          console.error('Subtitles recognition cleanup error:', error);
        }
      }
    };
  }, []);

  // User input speech recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const latestResult = event.results[event.results.length - 1];
      if (latestResult && latestResult.isFinal) {
        setTranscript(prev => prev + latestResult[0]?.transcript + ' ');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('User recognition error:', event.error);
      setIsRecording(false);
    };

    userRecognitionRef.current = recognition;

    return () => {
      if (userRecognitionRef.current && isRecording) {
        try {
          userRecognitionRef.current.stop();
        } catch (error) {
          console.error('User recognition cleanup error:', error);
        }
      }
    };
  }, [isRecording]);

  // Video event handlers
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handlePlay = () => {
        if (subtitleRecognitionRef.current) {
          try {
            isSubtitlesEnabled.current = true;
            subtitleRecognitionRef.current.start();
          } catch (error) {
            console.error('Subtitles recognition error:', error);
          }
        }
      };

      const handlePause = () => {
        if (subtitleRecognitionRef.current) {
          try {
            isSubtitlesEnabled.current = false;
            subtitleRecognitionRef.current.stop();
          } catch (error) {
            console.error('Subtitles recognition error:', error);
          }
        }
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const toggleRecording = () => {
    const recognition = userRecognitionRef.current;
    if (!recognition) return;

    try {
      if (!isRecording) {
        recognition.start();
      } else {
        recognition.stop();
      }
      setIsRecording(!isRecording);
    } catch (error) {
      console.error('Toggle recording error:', error);
    }
  };

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
      setSubtitles('');
    }
  };

  const handleVideoEnd = () => {
    setShowCompletionModal(true);
  };

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      <VideoPlayer
        videoRef={videoRef}
        isVideoPlaying={isVideoPlaying}
        handleVideoToggle={handleVideoToggle}
        subtitles={subtitles}
        onVideoEnd={handleVideoEnd}
      />

      <AudioControl />

      <ChatOverlay
        isVisible={!isVideoPlaying}
        onClose={handleVideoToggle}
      />
      
      <div className='absolute bottom-0 left-0 right-0 flex w-full items-center gap-2 m-2 z-30'>
        <ControlBar
          isVideoPlaying={isVideoPlaying}
          isRecording={isRecording}
          transcript={transcript}
          handleVideoToggle={handleVideoToggle}
          toggleRecording={toggleRecording}
          setTranscript={setTranscript}
          setIsFileModalOpen={setIsFileModalOpen}
          setShowErrorModal={setShowErrorModal}
        />
        <NotesSection
          isNotesEnabled={isNotesEnabled}
          setIsNotesEnabled={setIsNotesEnabled}
        />
      </div>

      {isNotesEnabled && (
        <div className="absolute inset-0 bottom-20 backdrop-blur-sm z-30">
          <div className="w-full h-full p-2 flex flex-col gap-4">
            <p className="w-full h-full flex-1 bg-black/30 text-white p-4 rounded-lg">
              <Image src="/image-2.png" alt='notes' width={5000} height={5000} className='w-full h-full'/>
            </p>
          </div>
        </div>
      )}

      <FileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => {
          setShowErrorModal(false);
        }}
      />
      
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={() => {
          setShowCompletionModal(false);
          setIsVideoPlaying(false);
        }}
      />
    </div>
  )
}

export default Teaching