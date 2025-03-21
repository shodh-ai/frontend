// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { MdClose, MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
// import { io } from "socket.io-client";
// import VisualizationPanel from "./doubtComponents/VisualizationPanel";
// import RealtimeAudioPlayer from "./doubtComponents/RealTimeAudioPlayer";
// import ERVisualization from "./visualizationComponents/ERVisualization";
// import DocumentVisualization from './visualizationComponents/DocumentVisualization';
// import HierarchicalVisualization from './visualizationComponents/HierarchicalVisualization';
// import EntityVisualization from './visualizationComponents/EntityVisualization';
// import AttributeVisualization from './visualizationComponents/AttributeVisualization';
// import SharedMemoryVisualization from './visualizationComponents/SharedMemoryVisualization';
// import SharedDiskVisualization from './visualizationComponents/SharedDiskVisualization';
// import SharedNothingVisualization from './visualizationComponents/SharedNothingVisualization';
// import DistributedDatabaseVisualization from './visualizationComponents/DistributedDatabaseVisualization';
// import OOPConceptsVisualization from './visualizationComponents/OOPConceptsVisualization';
// import RelationalQueryVisualization from './visualizationComponents/RelationalqueryVisualization';
// // import NormalFormVisualization from './visualizationComponents/NormalizationVisualization';
// // import ActiveDBVisualization from './visualizationComponents/ActivedbVisualization';
// import QueryProcessingVisualization from './visualizationComponents/QueryprocessingVisualization';
// // import MobiledbVisualization from './visualizationComponents/MobiledbVisualization';
// // import GISVisualization from './visualizationComponents/GisVisualization';
// // import BusinessPolicyVisualization from './visualizationComponents/BusinessPolicyVisualization';


// const VISUALIZATIONS = {
//   er: ERVisualization,
//   document: DocumentVisualization,
//   hierarchical: HierarchicalVisualization,
//   entity: EntityVisualization,
//   attribute: AttributeVisualization,
//   shared_memory: SharedMemoryVisualization,
//   shared_disk: SharedDiskVisualization,
//   shared_nothing: SharedNothingVisualization,
//   distributed_database: DistributedDatabaseVisualization,
//   oop_concepts: OOPConceptsVisualization,
//   relationalQuery: RelationalQueryVisualization,
//   queryprocessing: QueryProcessingVisualization,
// };

// export default function MainVisualization({ handleSideTab, activeSideTab, currentTopic }) {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [visualizationData, setVisualizationData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [highlightedElements, setHighlightedElements] = useState([]);
//   const [content, setContent] = useState("");
//   const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
//   const [isLoadingAudio, setIsLoadingAudio] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [realtimeSession, setRealtimeSession] = useState(null);
//   const [isMicActive, setIsMicActive] = useState(true); // Start with mic on
//   const microphoneStreamRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const microphoneSourceRef = useRef(null);

//   useEffect(() => {
//     if (currentTopic) {
//       const placeholderData = getPlaceholderData(currentTopic);
//       setVisualizationData(placeholderData);
//     }
//   }, [currentTopic]);

//   useEffect(() => {
//     const newSocket = io(process.env.NEXT_PUBLIC_SHODH_ML_URL, {
//       transports: ["websocket", "polling"],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       timeout: 20000,
//       autoConnect: true,
//     });

//     newSocket.on("connect", () => {
//       console.log("Connected to server");
//       setIsConnected(true);
//       loadVisualization(currentTopic);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from server");
//       setIsConnected(false);
//     });

//     newSocket.on("visualization_response", (data) => {
//       console.log("Received visualization data:", data);
//       setVisualizationData(data);
//       window.visualizationData = data;
//       setIsLoading(false);
//       initiateWebRTCSession(data.topic || currentTopic);
//     });

//     newSocket.on("error", (err) => {
//       console.error("Socket error:", err);
//       setError(`Error: ${err.message || "Unknown error"}`);
//       setIsLoading(false);
//     });

//     setSocket(newSocket);

//     return () => {
//       if (newSocket) newSocket.disconnect();
//     };
//   }, [currentTopic]);

//   // Voice Activity Detection Setup
//   const setupVoiceDetection = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//       });
//       microphoneStreamRef.current = stream;

//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       audioContextRef.current = audioContext;
//       const analyser = audioContext.createAnalyser();
//       analyserRef.current = analyser;
//       analyser.fftSize = 2048;
//       const microphone = audioContext.createMediaStreamSource(stream);
//       microphoneSourceRef.current = microphone;
//       microphone.connect(analyser);

//       const dataArray = new Uint8Array(analyser.frequencyBinCount);
//       let silenceStart = null;
//       const threshold = 50;
//       const silenceDelay = 1000;

//       const checkVoiceActivity = () => {
//         if (!isMicActive) return; // Stop VAD if mic is off
//         analyser.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;

//         if (average > threshold) {
//           if (!isRecording) {
//             console.log("Speech detected, turning on recording");
//             setIsRecording(true);
//             silenceStart = null;
//           }
//         } else if (isRecording) {
//           if (!silenceStart) silenceStart = Date.now();
//           if (Date.now() - silenceStart > silenceDelay) {
//             console.log("Silence detected, turning off recording");
//             setIsRecording(false);
//             silenceStart = null;
//           }
//         }
//         requestAnimationFrame(checkVoiceActivity);
//       };

//       checkVoiceActivity();
//     } catch (err) {
//       console.error("Error setting up voice detection:", err);
//       setError("Failed to access microphone for voice detection.");
//       setIsMicActive(false);
//     }
//   };

//   // Cleanup Microphone
//   const cleanupMicrophone = () => {
//     if (microphoneStreamRef.current) {
//       const tracks = microphoneStreamRef.current.getTracks();
//       tracks.forEach(track => {
//         track.stop(); // Stop the track
//         console.log(`Stopped track: ${track.kind}, id: ${track.id}, enabled: ${track.enabled}`);
//       });
//       microphoneStreamRef.current = null; // Clear the reference
//       console.log("Microphone stream reference cleared");
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close()
//         .then(() => {
//           console.log("AudioContext closed");
//           audioContextRef.current = null;
//         })
//         .catch(err => console.error("Error closing AudioContext:", err));
//     }
//     setIsRecording(false);
//   };

//   // Toggle Microphone
//   const toggleMicrophone = () => {
//     if (isMicActive) {
//       console.log("Turning off microphone");
//       cleanupMicrophone();
//       setIsMicActive(false);
//     } else {
//       console.log("Turning on microphone");
//       setIsMicActive(true);
//       setupVoiceDetection();
//     }
//   };

//   // Start mic on mount
//   useEffect(() => {
//     setupVoiceDetection();
//     return () => {
//       cleanupMicrophone();
//     };
//   }, []);

//   const loadVisualization = (topic) => {
//     if (!socket || !isConnected) {
//       console.log("Socket not connected, using placeholder data");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     socket.emit("visualization", { topic });
//   };

//   const getPlaceholderData = (topic) => {
//     if (topic === "er") {
//       return {
//         nodes: [
//           { id: "student", name: "Student", type: "entity", attributes: [{ name: "student_id", isKey: true }, { name: "name", isKey: false }, { name: "email", isKey: false }] },
//           { id: "course", name: "Course", type: "entity", attributes: [{ name: "course_id", isKey: true }, { name: "title", isKey: false }, { name: "credits", isKey: false }] },
//           { id: "enrollment", name: "Enrolls", type: "relationship" },
//         ],
//         edges: [
//           { source: "student", target: "enrollment", type: "participates" },
//           { source: "enrollment", target: "course", type: "participates" },
//         ],
//         topic,
//         narration: "Loading narration... (Offline Mode)",
//         narration_timestamps: [],
//       };
//     }
//     return {
//       nodes: [],
//       edges: [],
//       topic,
//       narration: `Placeholder for ${topic.replace("_", " ")} (Offline Mode)`,
//       narration_timestamps: [],
//     };
//   };

//   const initiateWebRTCSession = (topic, doubtText = "") => {
//     if (!socket || !isConnected) {
//       setError("Not connected to server, WebRTC unavailable");
//       return;
//     }
//     console.log("Initiating WebRTC session for topic:", topic);
//     const sessionId = Date.now().toString();
//     setRealtimeSession({
//       sessionId,
//       topic,
//       doubt: doubtText,
//       visualizationData,
//     });
//     socket.emit("start_webrtc_session", { sessionId, topic, doubt: doubtText });
//   };

//   const handleDoubtSubmit = () => {
//     if (!content.trim() || !currentTopic) {
//       setError("Please enter a doubt and select a topic");
//       return;
//     }
//     if (!socket || !isConnected) {
//       setError("Not connected to server, cannot submit doubt");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     initiateWebRTCSession(currentTopic, content);
//     setContent("");
//     setIsLoading(false);
//   };

//   const closeAISession = () => {
//     console.log("Closing AI session");
//     setRealtimeSession(null);
//     setHighlightedElements([]);
//     setIsPlaying(false);
//     if (isMicActive) toggleMicrophone(); // Turn off mic when closing
//   };

//   const renderVisualization = () => {
//     if (!visualizationData || !currentTopic) return <div>No topic selected</div>;
//     const VisualizationComponent = VISUALIZATIONS[currentTopic];
//     if (!VisualizationComponent) return <div>No visualization component available for {currentTopic}</div>;
//     return (
//       <VisualizationComponent
//         data={visualizationData}
//         highlightedElements={highlightedElements}
//         currentTime={Date.now()}
//       />
//     );
//   };

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("start_webrtc_session", (data) => {
//       console.log("WebRTC session request received:", data);
//       setRealtimeSession((prevSession) => {
//         if (prevSession) return prevSession;
//         if (!visualizationData && data.topic) socket.emit("visualization", { topic: data.topic });
//         setHighlightedElements([]);
//         return {
//           sessionId: data.sessionId,
//           topic: data.topic,
//           doubt: data.doubt,
//           visualizationData,
//         };
//       });
//     });
//     return () => socket.off("start_webrtc_session");
//   }, [socket, visualizationData]);

//   const handleNarrationComplete = (highlightedNodes, isComplete) => {
//     if (highlightedNodes && highlightedNodes.length > 0) setHighlightedElements([...highlightedNodes]);
//     if (isComplete) {
//       setRealtimeSession(null);
//       setIsPlaying(false);
//     }
//   };

//   const handlePlayingChange = (playing) => {
//     setIsPlaying(playing);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleDoubtSubmit();
//   };

//   const handleChange = (e) => setContent(e);

//   return (
//     <div className="app-container">
//       <header>
//         <h1>Database Visualization</h1>
//         <div className="connection-status">
//           {isConnected ? <span>Connected</span> : <span>Disconnected</span>}
//         </div>
//       </header>

//       <div className="main-content">
//         <div className="visualization-container">
//           <VisualizationPanel>
//             {error ? <div>{error}</div> : renderVisualization()}
//             {isLoading && (
//               <div>
//                 <div className="loading-spinner"></div>
//               </div>
//             )}
//           </VisualizationPanel>
//         </div>

//         {realtimeSession && isConnected && (
//           <RealtimeAudioPlayer
//             topic={realtimeSession.topic}
//             doubt={realtimeSession.doubt}
//             sessionId={realtimeSession.sessionId}
//             onComplete={handleNarrationComplete}
//             visualizationData={visualizationData}
//             microphoneStream={microphoneStreamRef.current}
//             isRecording={isRecording}
//             onPlayingChange={handlePlayingChange}
//             onClose={closeAISession}
//           />
//         )}
//       </div>

//       <div className="absolute bottom-0 left-0 right-0 flex w-full p-2 items-center gap-2 my-2 z-30">
//         <div className="flex gap-2">
//           <button
//             className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${
//               activeSideTab === 0 ? "bg-barBgColor" : ""
//             }`}
//             onClick={() => handleSideTab(0)}
//           >
//             <Image
//               src={"/knowledgeGraph.svg"}
//               alt="image"
//               height={40}
//               width={40}
//               className="min-w-[24px] min-h-[24px] w-full"
//             />
//           </button>
//           <button
//             className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${
//               activeSideTab === 1 ? "bg-barBgColor" : ""
//             }`}
//             onClick={() => handleSideTab(1)}
//           >
//             <Image
//               src={"/QuestionIcon.svg"}
//               alt="image"
//               height={40}
//               width={40}
//               className="min-w-[24px] min-h-[24px] w-full"
//             />
//           </button>
//         </div>
//         <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
//           <div className="flex gap-3 w-full">
//             <Image src={"/UploadFileIcon.svg"} alt="image" height={24} width={24} />
//             <input
//               placeholder="Ask me anything!"
//               className="border-none focus:outline-none bg-transparent w-full text-nowrap"
//               onChange={(e) => handleChange(e.target.value)}
//               type="text"
//               value={content}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//           <Image
//             src={"/SendIcon.svg"}
//             className="cursor-pointer"
//             alt="image"
//             height={32}
//             width={32}
//             onClick={() => {
//               handleDoubtSubmit();
//               setContent("");
//             }}
//           />
//         </div>
//         <div className="flex gap-2">
//           <button
//             className={`p-2 border border-[var(--Border-Secondary)] rounded-lg ${
//               isMicActive ? "text-red-500" : ""
//             } transition-colors relative`}
//             onClick={toggleMicrophone}
//           >
//             <div className="relative">
//               <MdMicNone size="1.5em" className={isMicActive ? "relative z-10" : ""} />
//               {isMicActive && (
//                 <div className="absolute inset-0 -m-2 z-0 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-red-500/75" />
//               )}
//             </div>
//           </button>
//           <button
//             className={`border border-[var(--Border-Secondary)] rounded-lg p-2 
//               ${isLoadingAudio ? "opacity-50 cursor-not-allowed" : ""} 
//               ${isPlaying ? "bg-blue-500" : ""} 
//               ${isHighlightPlayButton ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]" : ""}`}
//             disabled={isLoadingAudio}
//           >
//             {isLoadingAudio ? (
//               <div className="loader border-4 border-t-transparent border-gray-300 rounded-full w-6 h-6 animate-spin"></div>
//             ) : isPlaying ? (
//               <MdPause size="1.3em" />
//             ) : (
//               <MdPlayArrow size="1.3em" />
//             )}
//           </button>
//           <button
//             className="border border-[var(--Border-Secondary)] rounded-lg p-3"
//             onClick={closeAISession}
//           >
//             <MdClose size="1.2em" />
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         @keyframes ping {
//           0% { transform: scale(1); opacity: 1; }
//           75%, 100% { transform: scale(2); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdClose, MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
import { io } from "socket.io-client";
import VisualizationPanel from "./doubtComponents/VisualizationPanel";
import RealtimeAudioPlayer from "./doubtComponents/RealTimeAudioPlayer";
import ERVisualization from "./visualizationComponents/ERVisualization";
import DocumentVisualization from './visualizationComponents/DocumentVisualization';
import HierarchicalVisualization from './visualizationComponents/HierarchicalVisualization';
import EntityVisualization from './visualizationComponents/EntityVisualization';
import AttributeVisualization from './visualizationComponents/AttributeVisualization';
import SharedMemoryVisualization from './visualizationComponents/SharedMemoryVisualization';
import SharedDiskVisualization from './visualizationComponents/SharedDiskVisualization';
import SharedNothingVisualization from './visualizationComponents/SharedNothingVisualization';
import DistributedDatabaseVisualization from './visualizationComponents/DistributedDatabaseVisualization';
import OOPConceptsVisualization from './visualizationComponents/OOPConceptsVisualization';
import RelationalQueryVisualization from './visualizationComponents/RelationalqueryVisualization';
import QueryProcessingVisualization from './visualizationComponents/QueryprocessingVisualization';

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
};

export default function MainVisualization({ handleSideTab, activeSideTab, currentTopic }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [visualizationData, setVisualizationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedElements, setHighlightedElements] = useState([]);
  const [content, setContent] = useState("");
  const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [realtimeSession, setRealtimeSession] = useState(null);
  const [isMicActive, setIsMicActive] = useState(true);
  const microphoneStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneSourceRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const audioPlayerRef = useRef(null);
  const [isNarrationOnly, setIsNarrationOnly] = useState(false);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SHODH_ML_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      if (isInitialLoad) {
        setIsInitialLoad(false);
        handleTopicChange(currentTopic || 'er');
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('visualization_response', (data) => {
      console.log('Received visualization data:', data);
      setVisualizationData(data);
      window.visualizationData = data;
      setIsLoading(false);
      setIsNarrationOnly(true);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(`Error: ${err.message || 'Unknown error'}`);
      setIsLoading(false);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isInitialLoad, currentTopic]);

  const handleTopicChange = (topic) => {
    if (isNarrationPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.stopNarration();
      setIsNarrationPlaying(false);
      setIsNarrationOnly(false);
    }
    
    setHighlightedElements([]);
    const placeholderData = getPlaceholderData(topic);
    setVisualizationData(placeholderData);
    
    if (topic) {
      loadVisualization(topic);
    }
  };

  const getPlaceholderData = (topic) => {
    if (topic === 'er') {
      return {
        nodes: [
          { id: "student", name: "Student", type: "entity", attributes: [
            { name: "student_id", isKey: true },
            { name: "name", isKey: false },
            { name: "email", isKey: false }
          ]},
          { id: "course", name: "Course", type: "entity", attributes: [
            { name: "course_id", isKey: true },
            { name: "title", isKey: false },
            { name: "credits", isKey: false }
          ]},
          { id: "enrollment", name: "Enrolls", type: "relationship" }
        ],
        edges: [
          { source: "student", target: "enrollment", type: "participates" },
          { source: "enrollment", target: "course", type: "participates" }
        ],
        topic: topic,
        narration: "Loading narration...",
        narration_timestamps: []
      };
    }
    // Add other placeholder data as in original code...
    else {
      return {
        nodes: [
          { id: `${topic}_node1`, name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Node 1`, type: "generic" },
          { id: `${topic}_node2`, name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Node 2`, type: "generic" },
          { id: `${topic}_node3`, name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Node 3`, type: "generic" }
        ],
        edges: [
          { source: `${topic}_node1`, target: `${topic}_node2`, type: "connection" },
          { source: `${topic}_node2`, target: `${topic}_node3`, type: "connection" }
        ],
        topic: topic,
        narration: `Loading ${topic.replace('_', ' ')} visualization...`,
        narration_timestamps: []
      };
    }
  };

  const loadVisualization = (topic) => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }
    setIsLoading(true);
    setError(null);
    socket.emit('visualization', { topic });
  };

  const initiateWebRTCSession = (topic, doubtText = '') => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }
    const sessionId = Date.now().toString();
    setRealtimeSession({
      sessionId: sessionId,
      topic: topic,
      doubt: doubtText,
      visualizationData: visualizationData
    });
    socket.emit('start_webrtc_session', {
      sessionId: sessionId,
      topic: topic,
      doubt: doubtText
    });
  };

  const handleDoubtSubmit = () => {
    if (!content.trim()) return;
    setIsLoading(true);
    if (isNarrationPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.stopNarration();
      setIsNarrationPlaying(false);
    }
    initiateWebRTCSession(currentTopic, content);
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
    socket.on('start_webrtc_session', (data) => {
      setRealtimeSession(prevSession => {
        if (prevSession) return prevSession;
        if (!visualizationData && data.topic) {
          socket.emit('visualization', { topic: data.topic });
        }
        setHighlightedElements([]);
        return {
          sessionId: data.sessionId,
          topic: data.topic,
          doubt: data.doubt,
          visualizationData: visualizationData
        };
      });
    });
    return () => {
      socket.off('start_webrtc_session');
    };
  }, [socket, visualizationData]);

  const handleNarrationComplete = (highlightedNodes, isComplete = true) => {
    if (highlightedNodes && highlightedNodes.length > 0) {
      if (visualizationData && visualizationData.nodes) {
        const validNodeIds = visualizationData.nodes.map(node => node.id);
        const validHighlights = highlightedNodes.filter(id => validNodeIds.includes(id));
        setHighlightedElements(validHighlights);
      } else {
        setHighlightedElements([...highlightedNodes]);
      }
    } else if (highlightedNodes && highlightedNodes.length === 0) {
      setHighlightedElements([]);
    }
    if (isComplete) {
      setIsNarrationPlaying(false);
      if (realtimeSession) {
        setRealtimeSession(null);
      }
    }
  };

  const handlePlayNarration = () => {
    if (currentTopic) {
      setIsNarrationOnly(true);
      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.stopNarration();
          audioPlayerRef.current.playNarrationScript(currentTopic);
          setIsNarrationPlaying(true);
        }
      }, 100);
    }
  };

  const toggleMicrophone = () => {
    setIsMicActive(!isMicActive);
    // Add microphone logic here if needed
  };

  const closeAISession = () => {
    if (realtimeSession) {
      setRealtimeSession(null);
    }
    if (isNarrationPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.stopNarration();
      setIsNarrationPlaying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDoubtSubmit();
      setContent("");
    }
  };

  return (
    <div className="app-container relative">
      <header>
        <h1>Database Visualization</h1>
        <div className="connection-status">
          {isConnected ? (
            <span className="connected">Connected</span>
          ) : (
            <span className="disconnected">Disconnected</span>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="visualization-container">
          <VisualizationPanel>
            {error ? (
              <div className="error">{error}</div>
            ) : (
              renderVisualization()
            )}
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
          </VisualizationPanel>
        </div>

        {realtimeSession ? (
          <div className="realtime-container">
            <RealtimeAudioPlayer 
              ref={audioPlayerRef}
              topic={realtimeSession.topic}
              doubt={realtimeSession.doubt}
              sessionId={realtimeSession.sessionId}
              onComplete={handleNarrationComplete}
              visualizationData={visualizationData}
            />
          </div>
        ) : (
          <div className="placeholder-message">
            <h3>Interactive Database Learning</h3>
            <p>Explore the current topic: {currentTopic}</p>
            {visualizationData && (
              <div className="narration-controls">
                <p>The visualization is now loaded. You can:</p>
                <button 
                  className={`play-narration-btn ${isNarrationPlaying ? 'playing' : ''}`}
                  onClick={handlePlayNarration}
                  disabled={isNarrationPlaying}
                >
                  {isNarrationPlaying ? 'Narration Playing...' : 'Play Narration'}
                </button>
                <p>Or ask questions about the topic using the input below.</p>
              </div>
            )}
            {isNarrationOnly && visualizationData && (
              <div style={{ display: 'none' }}>
                <RealtimeAudioPlayer 
                  ref={audioPlayerRef}
                  topic={currentTopic}
                  doubt=""
                  sessionId={`narration-${Date.now()}`}
                  onComplete={handleNarrationComplete}
                  visualizationData={visualizationData}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex w-full p-2 items-center gap-2 my-2 z-30">
        <div className="flex gap-2">
          <button
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${
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
        <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
          <div className="flex gap-3 w-full">
            <Image src={"/UploadFileIcon.svg"} alt="image" height={24} width={24} />
            <input
              placeholder="Ask me anything!"
              className="border-none focus:outline-none bg-transparent w-full text-nowrap"
              onChange={(e) => setContent(e.target.value)}
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
              handleDoubtSubmit();
              setContent("");
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`p-2 border border-[var(--Border-Secondary)] rounded-lg ${
              isMicActive ? "text-red-500" : ""
            } transition-colors relative`}
            // onClick={toggleMicrophone}
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
              ${isLoadingAudio ? "opacity-50 cursor-not-allowed" : ""} 
              ${isPlaying ? "bg-blue-500" : ""} 
              ${isHighlightPlayButton ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]" : ""}`}
            disabled={isLoadingAudio}
            onClick={() => setIsPlaying(!isPlaying)}
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
            className="border border-[var(--Border-Secondary)] rounded-lg p-3"
            onClick={closeAISession}
          >
            <MdClose size="1.2em" />
          </button>
        </div>
      </div>
    </div>
  );
}