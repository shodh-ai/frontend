import Image from "next/image";
import { useEffect,useRef, useState } from "react";
import { io } from 'socket.io-client';
import { MdClose, MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
export default function DoubtHandle({ handleSideTab, activeSideTab }) {
  const [content, setContent] = useState("");
  const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizationData, setVisualizationData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [highlightedElements, setHighlightedElements] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);
  const audioChunks = useRef([]);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const [audioQueue, setAudioQueue] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const currentAudioRef = useRef(null);
  
  // Add state for timing chunks
  const [timingChunks, setTimingChunks] = useState([]);
  const [narrationTimestamps, setNarrationTimestamps] = useState([]);
  
  // Add state for realtime session
  const [realtimeSession, setRealtimeSession] = useState(null);
  

  useEffect(() => {
      // Configure Socket.IO client with proper options
      const newSocket = io({
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        autoConnect: true
      });
  
      // Socket event handlers
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        
        // If this is the initial load, automatically select the ER model
        if (isInitialLoad) {
          setIsInitialLoad(false);
        //   handleTopicChange('er');
        }
      });
  
      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });
  
      newSocket.on('visualization_response', (data) => {
        console.log('Received visualization data:', data);
        setVisualizationData(data);
        
        // Make visualization data available globally for the RealtimeAudioPlayer
        window.visualizationData = data;
        
        setIsLoading(false);
      });
  
      newSocket.on('audio_chunk', (chunk) => {
        audioChunks.current.push(chunk);
      });
  
      newSocket.on('audio_complete', (data) => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunks.current = [];
        
        if (data.word_timings) {
          // Process word timings for highlighting
          console.log('Word timings received:', data.word_timings);
        }
      });
  
      newSocket.on('doubt_response', (data) => {
        console.log('Received doubt response:', data);
        setDoubtResponse(data);
        setIsLoading(false);
      });
  
      newSocket.on('error', (err) => {
        console.error('Socket error:', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        setIsLoading(false);
      });
  
      setSocket(newSocket);
  
      // Cleanup on unmount
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isInitialLoad]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      //   handleDoubtSubmission(content);

      setContent("");
    }
  };

  const handleChange = (e) => {
    setContent(e);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex w-full p-2 items-center gap-2 my-2 z-30">
      <div className="flex gap-2">
        <button
          className={`border border-[var(--Border-Secondary)] rounded-lg p-2   ${
            activeSideTab === 0 ? "bg-barBgColor" : ""
          }`}
          onClick={() => handleSideTab(0)}
        >
          <Image
            src={"/knowledgeGraph.svg"}
            alt="image"
            height={40}
            width={40}
            className="min-w-[24px] min-h-[24px] w-full"
          />
        </button>
        <button
          className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${
            activeSideTab === 1 ? "bg-barBgColor" : ""
          }`}
          onClick={() => handleSideTab(1)}
        >
          <Image
            src={"/QuestionIcon.svg"}
            alt="image"
            height={40}
            width={40}
            className="min-w-[24px] min-h-[24px] w-full"
          />
        </button>
      </div>
      <div className="bg-[#0D0D0D]  border border-[var(--Border-Secondary)]  p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
        <div className="flex gap-3 w-full">
          <Image
            src={"/UploadFileIcon.svg"}
            alt="image"
            height={24}
            width={24}
          />
          <input
            placeholder="Ask me anything!"
            className="border-none focus:outline-none   bg-transparent w-full text-nowrap"
            onChange={(e) => handleChange(e.target.value)}
            type="text"
            value={content}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Image
          src={"/SendIcon.svg"}
          className="cursor-pointer"
          alt="image"
          height={32}
          width={32}
          onClick={() => {
            // handleDoubtSubmission(content);
            setContent("");
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          className={`p-2  border border-[var(--Border-Secondary)] rounded-lg${
            isRecording ? "text-red-500" : ""
          } transition-colors relative`}
          //   onClick={toggleRecording}
        >
          <div className="relative ">
            <MdMicNone
              size="1.5em"
              className={isRecording ? "relative z-10" : ""}
            />
            {isRecording && (
              <div className="absolute inset-0 -m-2 z-0 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-red-500/75" />
            )}
          </div>
        </button>
        <button
          //   ref={playButtonRef}
          className={`border border-[var(--Border-Secondary)] rounded-lg p-2 
      ${isLoadingAudio ? "opacity-50 cursor-not-allowed" : ""} ${
            isPlaying ? "" : "bg-blue-500"
          } ${
            isHighlightPlayButton
              ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]"
              : ""
          }
            `}
          //   onClick={handlePlayPause}
          //   disabled={isLoadingAudio}
        >
          {isLoadingAudio ? (
            <div className="loader border-4 border-t-transparent border-gray-300 rounded-full w-6 h-6 animate-spin"></div>
          ) : isPlaying ? (
            <MdPause size="1.3em" />
          ) : (
            <MdPlayArrow size="1.3em" />
          )}
        </button>
        <button
          className={`border border-[var(--Border-Secondary)] rounded-lg p-3 }`}
        >
          <MdClose size="1.2em" />
        </button>
      </div>
    </div>
  );
}
