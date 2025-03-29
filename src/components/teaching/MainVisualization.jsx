import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdClose, MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
import { io } from "socket.io-client";
import VisualizationPanel from "./doubtComponents/VisualizationPanel";
import RealtimeAudioPlayer from "./doubtComponents/RealTimeAudioPlayer";
import ERVisualization from "./visualizationComponents/ERVisualization";
import DocumentVisualization from "./visualizationComponents/DocumentVisualization";
import HierarchicalVisualization from "./visualizationComponents/HierarchicalVisualization";
import EntityVisualization from "./visualizationComponents/EntityVisualization";
import AttributeVisualization from "./visualizationComponents/AttributeVisualization";
import SharedMemoryVisualization from "./visualizationComponents/SharedMemoryVisualization";
import SharedDiskVisualization from "./visualizationComponents/SharedDiskVisualization";
import SharedNothingVisualization from "./visualizationComponents/SharedNothingVisualization";
import DistributedDatabaseVisualization from "./visualizationComponents/DistributedDatabaseVisualization";
import OOPConceptsVisualization from "./visualizationComponents/OOPConceptsVisualization";
import RelationalQueryVisualization from "./visualizationComponents/RelationalqueryVisualization";
import QueryProcessingVisualization from "./visualizationComponents/QueryprocessingVisualization";
import GdpVisualization from "./visualizationComponents/GdpVisualization";

const VISUALIZATIONS = {
  er: ERVisualization,
  document: DocumentVisualization,
  hierarchical: HierarchicalVisualization,
  entity: EntityVisualization,
  attribute: AttributeVisualization,
  shared_memory: SharedMemoryVisualization,
  shared_disk: SharedDiskVisualization,
  shared_nothing: SharedNothingVisualization,
  distributed_database: DistributedDatabaseVisualization,
  oop_concepts: OOPConceptsVisualization,
  relationalQuery: RelationalQueryVisualization,
  queryprocessing: QueryProcessingVisualization,
  gdp: GdpVisualization,
};

// Define the topic sequence
const TOPIC_SEQUENCE = ["er", "gdp", "equation"];

export default function MainVisualization({
  handleSideTab,
  activeSideTab,
  currentTopic,
  setCurrentTopic,
}) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [visualizationData, setVisualizationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedElements, setHighlightedElements] = useState([]);
  const [content, setContent] = useState("");
  const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [realtimeSession, setRealtimeSession] = useState(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isNarrationOnly, setIsNarrationOnly] = useState(false);
  const [isNarrationReady, setIsNarrationReady] = useState(false);
  const [showMicOffPopup, setShowMicOffPopup] = useState(false);
  const [initialMicShow, setInitialMicShow] = useState(true);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = useState(false);
  const [showLectureCompletePopup, setShowLectureCompletePopup] = useState(false);

  const microphoneStreamRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SHODH_ML_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      if (currentTopic) {
        loadVisualization(currentTopic);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("visualization_response", (data) => {
      console.log("Received visualization data:", data);
      setVisualizationData(data);
      window.visualizationData = data;
      setIsLoading(false);
      setIsLoadingAudio(false); // Audio is ready when visualization data is received
      setIsNarrationOnly(true);
      setIsNarrationReady(true);
      setIsHighlightPlayButton(true);
    });

    newSocket.on("error", (err) => {
      console.error("Socket error:", err);
      setError(`Error: ${err.message || "Unknown error"}`);
      setIsLoading(false);
      setIsLoadingAudio(false);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [currentTopic]);

  // Reset audio states when topic changes
  useEffect(() => {
    if (currentTopic) {
      // Stop and clear any existing audio
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stopNarration();
      }
      setIsPlaying(false);
      setIsPreparingAudio(false);
      setIsLoadingAudio(true); // Show loader until new audio is ready
      setIsHighlightPlayButton(false);
      setIsNarrationReady(false);
      setRealtimeSession(null);
      setHighlightedElements([]);

      // Load new visualization and placeholder data
      const placeholderData = getPlaceholderData(currentTopic);
      setVisualizationData(placeholderData);
      if (socket && isConnected) {
        loadVisualization(currentTopic);
      } else {
        // If not connected, simulate audio readiness with placeholder
        setTimeout(() => {
          setIsLoadingAudio(false);
          setIsNarrationReady(true);
          setIsHighlightPlayButton(true);
        }, 1000); // Small delay to mimic loading
      }
    }
  }, [currentTopic, socket, isConnected]);

  const loadVisualization = (topic) => {
    if (!socket || !isConnected) {
      console.log("Socket not connected, using placeholder data");
      setIsLoadingAudio(false);
      setIsNarrationOnly(true);
      setIsNarrationReady(true);
      setIsHighlightPlayButton(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    socket.emit("visualization", { topic });
  };

  const getPlaceholderData = (topic) => {
    if (topic === "er") {
      return {
        nodes: [
          { id: "student", name: "Student", type: "entity", attributes: [
            { name: "student_id", isKey: true },
            { name: "name", isKey: false },
            { name: "email", isKey: false },
          ]},
          { id: "course", name: "Course", type: "entity", attributes: [
            { name: "course_id", isKey: true },
            { name: "title", isKey: false },
            { name: "credits", isKey: false },
          ]},
          { id: "enrollment", name: "Enrolls", type: "relationship" },
        ],
        edges: [
          { source: "student", target: "enrollment", type: "participates" },
          { source: "enrollment", target: "course", type: "participates" },
        ],
        topic: topic,
        narration: "Loading narration...",
        narration_timestamps: [],
      };
    }
    return {
      nodes: [
        { id: `${topic}_node1`, name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Node 1`, type: "generic" },
        { id: `${topic}_node2`, name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Node 2`, type: "generic" },
        { id: `${topic}_node3`, name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Node 3`, type: "generic" },
      ],
      edges: [
        { source: `${topic}_node1`, target: `${topic}_node2`, type: "connection" },
        { source: `${topic}_node2`, target: `${topic}_node3`, type: "connection" },
      ],
      topic: topic,
      narration: `Loading ${topic.replace("_", " ")} visualization...`,
      narration_timestamps: [],
    };
  };

  const initiateWebRTCSession = async (topic, doubtText = "") => {
    if (!socket || !isConnected) {
      setError("Not connected to server");
      return;
    }

    if (!isMicActive || !microphoneStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStreamRef.current = stream;
        setIsMicActive(true);
      } catch (err) {
        setError(`Microphone access denied: ${err.message}`);
        return;
      }
    }

    const sessionId = Date.now().toString();
    setRealtimeSession({
      sessionId: sessionId,
      topic: topic,
      doubt: doubtText,
      visualizationData: visualizationData,
      microphoneStream: microphoneStreamRef.current,
    });
    socket.emit("start_webrtc_session", {
      sessionId: sessionId,
      topic: topic,
      doubt: doubtText,
    });
  };

  const startSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent(transcript);
      setIsSpeechRecognitionActive(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsSpeechRecognitionActive(false);
    };

    recognition.onend = () => {
      setIsSpeechRecognitionActive(false);
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
    setIsSpeechRecognitionActive(true);
  };

  const stopSpeechRecognition = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
      setIsSpeechRecognitionActive(false);
    }
  };

  const handleDoubtSubmit = () => {
    if (isPlaying) return;
    if (!content.trim() || !currentTopic) {
      setError("Please enter a doubt and ensure a topic is selected");
      return;
    }
    if (!socket || !isConnected) {
      setError("Not connected to server, cannot submit doubt");
      return;
    }
    setIsLoading(true);
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.stopNarration();
      setIsPlaying(false);
      setIsHighlightPlayButton(true);
    }
    initiateWebRTCSession(currentTopic, content);
    setContent("");
    stopSpeechRecognition();
  };

  const toggleMicrophone = async () => {
    if (isPlaying) return;
    if (!isMicActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStreamRef.current = stream;
        setIsMicActive(true);
        if (realtimeSession && audioPlayerRef.current) {
          audioPlayerRef.current.updateMicrophoneStream(stream);
        }
      } catch (err) {
        setError(`Microphone access denied: ${err.message}`);
      }
    } else {
      if (microphoneStreamRef.current && microphoneStreamRef.current.getTracks) {
        microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
        microphoneStreamRef.current = null;
        setIsMicActive(false);
        if (realtimeSession && audioPlayerRef.current) {
          audioPlayerRef.current.updateMicrophoneStream(null);
        }
        if (!isPlaying && realtimeSession) {
          setShowMicOffPopup(true);
        }
      }
      stopSpeechRecognition();
    }
  };

  const renderVisualization = () => {
    if (!visualizationData) {
      return <div>No visualization data available</div>;
    }
    const VisualizationComponent = VISUALIZATIONS[currentTopic];
    if (!VisualizationComponent) {
      return <div>No visualization component available for {currentTopic}</div>;
    }
    return (
      <VisualizationComponent
        data={visualizationData}
        highlightedElements={highlightedElements}
        currentTime={Date.now()}
      />
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("start_webrtc_session", (data) => {
      setRealtimeSession((prevSession) => {
        if (prevSession) return prevSession;
        setHighlightedElements([]);
        return {
          sessionId: data.sessionId,
          topic: data.topic,
          doubt: data.doubt,
          visualizationData: visualizationData,
          microphoneStream: microphoneStreamRef.current,
        };
      });
    });
    return () => {
      socket.off("start_webrtc_session");
    };
  }, [socket, visualizationData]);

  const handleNarrationComplete = (highlightedNodes, isComplete) => {
    if (highlightedNodes && highlightedNodes.length > 0) {
      if (currentTopic === "gdp") {
        setHighlightedElements(highlightedNodes);
      } else if (visualizationData && visualizationData.nodes) {
        const validNodeIds = visualizationData.nodes.map((node) => node.id);
        const validHighlights = highlightedNodes.filter((id) => validNodeIds.includes(id));
        setHighlightedElements(validHighlights);
      } else {
        setHighlightedElements([...highlightedNodes]);
      }
    } else if (isComplete) {
      setIsPlaying(false);
      setIsNarrationOnly(false);
      setIsPreparingAudio(false);
      setIsHighlightPlayButton(true);
      setHighlightedElements([]);
      setShowLectureCompletePopup(true);
    } else {
      setHighlightedElements([]);
    }
  };

  const handleMicOffPopupChoice = async (choice) => {
    setShowMicOffPopup(false);
    if (choice === "resume") {
      if (realtimeSession) {
        closeAISession();
      }
      setIsPreparingAudio(true);
      audioPlayerRef.current.playNarrationScript(currentTopic)
        .then(() => {
          setIsPlaying(true);
          setIsHighlightPlayButton(false);
        })
        .catch((err) => {
          console.error("Error playing narration:", err);
          setError("Failed to play narration");
          setIsPreparingAudio(false);
          setIsHighlightPlayButton(true);
        });
    } else if (choice === "doubt") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStreamRef.current = stream;
        setIsMicActive(true);
        if (realtimeSession && audioPlayerRef.current) {
          audioPlayerRef.current.updateMicrophoneStream(stream);
        }
      } catch (err) {
        setError(`Microphone access denied: ${err.message}`);
      }
    }
  };

  const handleTogglePlayPause = async () => {
    setInitialMicShow(false);
    if (!isNarrationReady || !audioPlayerRef.current) return;

    if (isPlaying) {
      audioPlayerRef.current.stopNarration();
      setIsPlaying(false);
      setIsPreparingAudio(false);
      setIsHighlightPlayButton(true);

      if (!isMicActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          microphoneStreamRef.current = stream;
          setIsMicActive(true);
          startSpeechRecognition();
        } catch (err) {
          setError(`Microphone access denied: ${err.message}`);
        }
      } else {
        startSpeechRecognition();
      }
    } else {
      if (realtimeSession) {
        closeAISession();
      }
      stopSpeechRecognition();
      setIsPreparingAudio(true);
      audioPlayerRef.current.playNarrationScript(currentTopic)
        .then(() => {
          setIsPlaying(true);
          setIsHighlightPlayButton(false);
        })
        .catch((err) => {
          console.error("Error playing narration:", err);
          setError("Failed to play narration");
          setIsPreparingAudio(false);
          setIsHighlightPlayButton(true);
        });
    }
  };

  const handleInputChange = (e) => {
    if (!isPlaying) {
      setContent(e.target.value);
    }
  };

  const handlePlayingChange = (isPlayingNow) => {
    if (isPlayingNow) {
      setIsPreparingAudio(false);
      setIsPlaying(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleDoubtSubmit();
    }
  };

  const closeAISession = () => {
    if (realtimeSession) {
      setRealtimeSession(null);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stopNarration();
      }
    }
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.stopNarration();
      setIsPlaying(false);
      setIsPreparingAudio(false);
      setIsHighlightPlayButton(true);
    }
    if (microphoneStreamRef.current && microphoneStreamRef.current.getTracks) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
      setIsMicActive(false);
    }
    stopSpeechRecognition();
  };

  const handleLectureCompleteChoice = (choice) => {
    setShowLectureCompletePopup(false);
    if (choice === "next") {
      const currentIndex = TOPIC_SEQUENCE.indexOf(currentTopic);
      const nextIndex = (currentIndex + 1) % TOPIC_SEQUENCE.length;
      setCurrentTopic(TOPIC_SEQUENCE[nextIndex]);
    } else if (choice === "restart") {
      setIsLoadingAudio(true);
      setIsHighlightPlayButton(false);
      setIsNarrationReady(false);
      loadVisualization(currentTopic);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Database Visualization</h1>
        <div className="connection-status">
          {isConnected ? <span>Connected</span> : <span>Disconnected</span>}
        </div>
      </header>

      <div className="main-content">
        <div className="visualization-container">
          <VisualizationPanel>
            {error ? <div>{error}</div> : renderVisualization()}
            {isLoading && (
              <div>
                <div className="loading-spinner"></div>
              </div>
            )}
          </VisualizationPanel>
        </div>

        <div style={{ display: realtimeSession ? "block" : "none" }}>
          {realtimeSession ? (
            <RealtimeAudioPlayer
              ref={audioPlayerRef}
              topic={realtimeSession.topic}
              doubt={realtimeSession.doubt}
              sessionId={realtimeSession.sessionId}
              onComplete={handleNarrationComplete}
              visualizationData={visualizationData}
              microphoneStream={microphoneStreamRef.current}
              onPlayingChange={handlePlayingChange}
            />
          ) : (
            visualizationData && (
              <RealtimeAudioPlayer
                ref={audioPlayerRef}
                topic={currentTopic}
                doubt=""
                sessionId={`narration-${Date.now()}`}
                onComplete={handleNarrationComplete}
                visualizationData={visualizationData}
                microphoneStream={null}
                onPlayingChange={handlePlayingChange}
              />
            )
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex w-full p-2 items-center gap-2 my-2 z-30">
        <div className="flex gap-2">
          <button
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${activeSideTab === 0 ? "bg-barBgColor" : ""}`}
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
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${activeSideTab === 1 ? "bg-barBgColor" : ""}`}
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
        <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
          <div className="flex gap-3 w-full">
            <Image src={"/UploadFileIcon.svg"} alt="image" height={24} width={24} />
            <input
              placeholder={isSpeechRecognitionActive ? "Listening to your doubt..." : "Ask me anything!"}
              className={`border-none focus:outline-none bg-transparent w-full text-nowrap ${isPlaying || initialMicShow ? 'opacity-50 cursor-not-allowed' : ''}`}
              onChange={handleInputChange}
              type="text"
              value={content}
              onKeyDown={handleKeyDown}
              disabled={isPlaying || initialMicShow || isSpeechRecognitionActive}
            />
          </div>
          <Image
            src={"/SendIcon.svg"}
            className={`cursor-pointer ${isPlaying ? 'opacity-50 pointer-events-none' : ''}`}
            alt="image"
            height={32}
            width={32}
            onClick={handleDoubtSubmit}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`p-2 border border-[var(--Border-Secondary)] rounded-lg ${isPlaying || initialMicShow ? 'opacity-50 cursor-not-allowed' : ''} ${isMicActive ? "text-red-500" : ""} transition-colors relative`}
            onClick={toggleMicrophone}
            disabled={isPlaying || initialMicShow}
          >
            <div className="relative">
              <MdMicNone size="1.5em" className={isMicActive ? "relative z-10" : ""} />
              {isMicActive && (
                <div className="absolute inset-0 -m-2 z-0 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-red-500/75" />
              )}
            </div>
          </button>
          <button
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 
              ${(isLoadingAudio || isPreparingAudio) ? "opacity-50 cursor-not-allowed" : ""} 
              ${isPlaying ? "bg-blue-500" : ""} 
              ${isHighlightPlayButton && !isPreparingAudio ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]" : ""}`}
            disabled={isLoadingAudio || isPreparingAudio || !isNarrationReady}
            onClick={handleTogglePlayPause}
          >
            {isLoadingAudio || isPreparingAudio ? (
              <div className="loader border-4 border-t-transparent border-gray-300 rounded-full w-6 h-6 animate-spin"></div>
            ) : isPlaying ? (
              <MdPause size="1.3em" />
            ) : (
              <MdPlayArrow size="1.3em" />
            )}
          </button>
          <button
            className="border border-[var(--Border-Secondary)] rounded-lg p-3"
            onClick={closeAISession}
          >
            <MdClose size="1.2em" />
          </button>
        </div>
      </div>

      {showMicOffPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
            <h2 className="text-base font-semibold text-black">Microphone Turned Off</h2>
            <p className="text-black">Do you want to resume your lecture or still have a doubt?</p>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleMicOffPopupChoice("resume")}
              >
                Resume Lecture
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleMicOffPopupChoice("doubt")}
              >
                Still Have Doubt
              </button>
            </div>
          </div>
        </div>
      )}

      {showLectureCompletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
            <h2 className="text-base font-semibold text-black">Lecture Completed</h2>
            <p className="text-black">
              You have completed the lecture on {currentTopic.toUpperCase()}. Would you like to continue to the next topic or restart this one?
            </p>
            <div className="flex gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleLectureCompleteChoice("next")}
              >
                Next Topic
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleLectureCompleteChoice("restart")}
              >
                Restart Current Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}