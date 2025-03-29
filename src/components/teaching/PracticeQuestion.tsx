// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import Image from "next/image";
// import { MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// import Visualiser from "./components/Visualiser";
// import visualization from "./components/data/visualisation.json";
// import transcript from "./components/data/transcript.json";
// import { Visualisation } from "./components/Visualisation";
// import DoubtSolver from "./doubtComponents/DoubtSolver";

// type Props = {
//   handleSideTab: (index: number) => void;
//   activeSideTab: number;
//   currentTopic: string;
// };

// interface DoubtSolverRef {
//   startDoubtSession: (textDoubt: string) => void;
//   stopSession: () => void;
// }

// interface SpeechErrorEvent extends Event {
//   error: string;
// }

// function getLastStartIndex(visualization: Visualisation): number {
//   const startOrders = visualization.elements.flatMap((element) =>
//     element.frames.map((frame) => frame.start_order)
//   );
//   return Math.max(...startOrders);
// }

// async function generateTTS(text: string): Promise<string> {
//   const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
//   if (!apiKey) throw new Error("NEXT_PUBLIC_OPENAI_API_KEY is not set");

//   const response = await fetch("https://api.openai.com/v1/audio/speech", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "tts-1",
//       voice: "alloy",
//       input: text,
//     }),
//   });

//   if (!response.ok) throw new Error(`TTS API error: ${response.statusText}`);
//   const audioBlob = await response.blob();
//   return URL.createObjectURL(audioBlob);
// }

// export default function PracticeQuestion({ handleSideTab, activeSideTab, currentTopic }: Props) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [startIndex, setStartIndex] = useState(0);
//   const [audioCache, setAudioCache] = useState<Map<number, string>>(new Map());
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasInitialized, setHasInitialized] = useState(false);
//   const [content, setContent] = useState("");
//   const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
//   const [isMicActive, setIsMicActive] = useState(false);
//   const [isFirstLoad, setIsFirstLoad] = useState(true);
//   const [isDoubtState, setIsDoubtState] = useState(false);
//   const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(null);
//   const [isSessionActive, setIsSessionActive] = useState(false);

//   const doubtSolverRef = useRef<DoubtSolverRef | null>(null);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   useEffect(() => {
//     setStartIndex(getLastStartIndex(visualization as Visualisation));
//   }, []);

//   useEffect(() => {
//     return () => {
//       audioCache.forEach((url) => URL.revokeObjectURL(url));
//       if (currentAudio) currentAudio.pause();
//       stopMicrophone();
//       if (isSessionActive) doubtSolverRef.current?.stopSession();
//     };
//   }, [audioCache, currentAudio, isSessionActive]);

//   const loadInitialAudio = useCallback(
//     async (newIndex: number) => {
//       const transcriptText = transcript[newIndex];
//       if (!transcriptText) return;

//       setIsLoading(true);
//       setError(null);

//       try {
//         let audioUrl = audioCache.get(newIndex);
//         if (!audioUrl) {
//           const generatedUrl = await generateTTS(transcriptText);
//           audioUrl = generatedUrl;
//           setAudioCache((prev) => new Map(prev).set(newIndex, generatedUrl));
//         }

//         const audio = new Audio(audioUrl);
//         audio.oncanplaythrough = () => {
//           setCurrentAudio(audio);
//           setCurrentIndex(newIndex);
//           setIsLoading(false);
//           setIsHighlightPlayButton(true);
//           setIsFirstLoad(false);
//         };
//         audio.onerror = () => {
//           setError("Failed to load audio");
//           setIsLoading(false);
//           setIsFirstLoad(false);
//         };
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "TTS generation failed");
//         setIsLoading(false);
//         setIsFirstLoad(false);
//       }
//     },
//     [audioCache]
//   );

//   const playAudioForIndex = useCallback(
//     async (newIndex: number) => {
//       const transcriptText = transcript[newIndex];
//       if (!transcriptText) return;

//       setIsLoading(true);
//       setError(null);
//       if (currentAudio) currentAudio.pause();

//       try {
//         let audioUrl = audioCache.get(newIndex);
//         if (!audioUrl) {
//           const generatedUrl = await generateTTS(transcriptText);
//           audioUrl = generatedUrl;
//           setAudioCache((prev) => new Map(prev).set(newIndex, generatedUrl));
//         }

//         const audio = new Audio(audioUrl);
//         audio.oncanplaythrough = () => {
//           setCurrentAudio(audio);
//           setCurrentIndex(newIndex);
//           audio.play();
//           setIsPlaying(true);
//           setIsLoading(false);
//         };
//         audio.onerror = () => {
//           setError("Failed to play audio");
//           setIsLoading(false);
//         };
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "TTS generation failed");
//         setIsLoading(false);
//       }
//     },
//     [audioCache, currentAudio]
//   );

//   const handleBack = useCallback(() => {
//     if (isLoading) return;
//     const newIndex = Math.max(currentIndex - 1, 0);
//     playAudioForIndex(newIndex);
//   }, [currentIndex, isLoading, playAudioForIndex]);

//   const handleForward = useCallback(() => {
//     if (isLoading) return;
//     const newIndex = Math.min(currentIndex + 1, startIndex);
//     playAudioForIndex(newIndex);
//   }, [currentIndex, startIndex, isLoading, playAudioForIndex]);

//   useEffect(() => {
//     if (!hasInitialized) {
//       loadInitialAudio(0); // Preload first audio
//       setHasInitialized(true);
//     }
//   }, [hasInitialized, loadInitialAudio]);

//   const handleTogglePlayPause = () => {
//     if (!hasInitialized) return; // Prevent action before initialization

//     if (isPlaying) {
//       if (currentAudio) currentAudio.pause(); // Null check added
//       setIsPlaying(false);
//       setIsDoubtState(true);
//       toggleMicrophone(true); // Mic on when pausing
//     } else {
//       if (isSessionActive) {
//         stopMicrophone();
//         doubtSolverRef.current?.stopSession(); // Stop WebRTC session
//         setIsSessionActive(false);
//       }
//       playAudioForIndex(currentIndex); // Resume from current index
//       setIsHighlightPlayButton(false);
//     }
//   };

//   const startSpeechRecognition = (stream: MediaStream) => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition || isSessionActive) {
//       if (!SpeechRecognition) setError("Speech recognition not supported");
//       return; // Skip speech recognition if session is active
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       const transcript = Array.from(event.results)
//         .map((result: SpeechRecognitionResult) => result[0].transcript)
//         .join("");
//       if (!isSessionActive) {
//         setContent(transcript); // Only update input before session starts
//       }
//     };

//     recognition.onerror = (event: SpeechErrorEvent) => {
//       setError("Speech recognition error: " + event.error);
//       recognition.stop();
//     };

//     recognition.onend = () => setIsMicActive(false);
//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   const stopMicrophone = () => {
//     if (microphoneStream) {
//       microphoneStream.getTracks().forEach((track) => track.stop());
//       setMicrophoneStream(null);
//     }
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//     setIsMicActive(false);
//   };

//   const toggleMicrophone = async (forceEnable = false) => {
//     if (isPlaying && !forceEnable) return;

//     if (forceEnable || !isMicActive) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
//         });
//         setMicrophoneStream(stream);
//         setIsMicActive(true);
//         if (!isSessionActive) startSpeechRecognition(stream); // Only use speech recognition before session
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to access microphone");
//       }
//     } else {
//       stopMicrophone();
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!isPlaying) setContent(e.target.value);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && isDoubtState && content.trim()) {
//       doubtSolverRef.current?.startDoubtSession(content);
//       if (!isSessionActive) setIsSessionActive(true); // Start session on first send
//       setContent(""); // Clear input after sending
//     }
//   };

//   const handleSendClick = () => {
//     if (isDoubtState && content.trim()) {
//       doubtSolverRef.current?.startDoubtSession(content);
//       if (!isSessionActive) setIsSessionActive(true); // Start session on first send
//       setContent(""); // Clear input after sending
//     }
//   };

//   const handleDoubtResolved = (updatedNodes: string[], isComplete: boolean) => {
//     if (updatedNodes.length > 0) {
//       console.log("Highlighted nodes:", updatedNodes);
//     }
//   };

//   const isBackDisabled = currentIndex === 0 || isLoading;
//   const isForwardDisabled = currentIndex === startIndex || isLoading;

//   return (
//     <div className="flex flex-col h-full w-full gap-2 relative overflow-hidden border border-dashBoardButtonBg rounded-xl bg-black">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
//           <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
//         </div>
//       )}
//       {error && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
//           <p className="text-red-500">{error}</p>
//         </div>
//       )}
//       <Visualiser visualization={visualization as Visualisation} currIndex={currentIndex} />

//       <div className="bottom-0 left-0 right-4 flex w-full p-2 items-center gap-2 my-2 z-30">
//         <div className="flex gap-2">
//           <button
//             className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${activeSideTab === 0 ? "bg-barBgColor" : ""}`}
//             onClick={() => handleSideTab(0)}
//           >
//             <Image src={"/knowledgeGraph.svg"} alt="image" height={40} width={40} className="min-w-[24px] min-h-[24px] w-full" />
//           </button>
//           <button
//             className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${activeSideTab === 1 ? "bg-barBgColor" : ""}`}
//             onClick={() => handleSideTab(1)}
//           >
//             <Image src={"/QuestionIcon.svg"} alt="image" height={40} width={40} className="min-w-[24px] min-h-[24px] w-full" />
//           </button>
//         </div>
//         <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
//           <div className="flex gap-3 w-full">
//             <Image src={"/UploadFileIcon.svg"} alt="image" height={24} width={24} />
//             <input
//               placeholder={isDoubtState ? "Type your doubt or speak..." : "Ask me anything!"}
//               className={`border-none focus:outline-none bg-transparent w-full text-nowrap ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
//               onChange={handleInputChange}
//               type="text"
//               value={content}
//               onKeyDown={handleKeyDown}
//               disabled={isPlaying}
//             />
//           </div>
//           <Image
//             src={"/SendIcon.svg"}
//             className={`cursor-pointer ${isPlaying || !isDoubtState ? "opacity-50 pointer-events-none" : ""}`}
//             alt="image"
//             height={32}
//             width={32}
//             onClick={handleSendClick}
//           />
//         </div>
//         <div className="flex gap-2">
//           <button
//             className={`p-2 border border-[var(--Border-Secondary)] rounded-lg ${isPlaying ? "opacity-50 cursor-not-allowed" : ""} ${isMicActive ? "text-red-500" : ""} transition-colors relative`}
//             onClick={() => toggleMicrophone()}
//             disabled={isPlaying}
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
//               ${isLoading && isFirstLoad ? "opacity-50 cursor-not-allowed" : ""} 
//               ${isPlaying ? "bg-blue-500" : ""} 
//               ${!isPlaying && isHighlightPlayButton && !isLoading ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]" : ""}`}
//             disabled={isLoading && isFirstLoad}
//             onClick={handleTogglePlayPause}
//           >
//             {isLoading && isFirstLoad ? (
//               <div className="loader border-4 border-t-transparent border-gray-300 rounded-full w-6 h-6 animate-spin"></div>
//             ) : isPlaying ? (
//               <MdPause size="1.3em" />
//             ) : (
//               <MdPlayArrow size="1.3em" />
//             )}
//           </button>
//           <button
//             className="border border-[var(--Border-Secondary)] rounded-lg p-3"
//             disabled={isBackDisabled}
//             onClick={handleBack}
//           >
//             <IoIosArrowBack size="1.2em" />
//           </button>
//           <button
//             className="border border-[var(--Border-Secondary)] rounded-lg p-3"
//             disabled={isForwardDisabled}
//             onClick={handleForward}
//           >
//             <IoIosArrowForward size="1.2em" />
//           </button>
//         </div>
//       </div>

//       <DoubtSolver
//         ref={doubtSolverRef}
//         topic={currentTopic}
//         doubt={content}
//         visualizationData={visualization}
//         microphoneStream={microphoneStream}
//         onComplete={handleDoubtResolved}
//       />
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Visualiser from "./components/Visualiser";
import visualization from "./components/data/visualisation.json";
import transcript from "./components/data/transcript.json";
import { Visualisation } from "./components/Visualisation";
import DoubtSolver from "./doubtComponents/DoubtSolver";

type Props = {
  handleSideTab: (index: number) => void;
  activeSideTab: number;
  currentTopic: string;
};

interface DoubtSolverRef {
  startDoubtSession: (textDoubt: string) => void;
  stopSession: () => void;
}

interface SpeechErrorEvent extends Event {
  error: string;
}

function getLastStartIndex(visualization: Visualisation): number {
  const startOrders = visualization.elements.flatMap((element) =>
    element.frames.map((frame) => frame.start_order)
  );
  return Math.max(...startOrders);
}

async function generateTTS(text: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_OPENAI_API_KEY is not set");

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      voice: "alloy",
      input: text,
    }),
  });

  if (!response.ok) throw new Error(`TTS API error: ${response.statusText}`);
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

export default function PracticeQuestion({ handleSideTab, activeSideTab, currentTopic }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [audioCache, setAudioCache] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [content, setContent] = useState("");
  const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDoubtState, setIsDoubtState] = useState(false);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0); // Still keeping this for pausing

  const doubtSolverRef = useRef<DoubtSolverRef | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setStartIndex(getLastStartIndex(visualization as Visualisation));
  }, []);

  useEffect(() => {
    return () => {
      audioCache.forEach((url) => URL.revokeObjectURL(url));
      if (currentAudio) currentAudio.pause();
      stopMicrophone();
      if (isSessionActive) doubtSolverRef.current?.stopSession();
    };
  }, [audioCache, currentAudio, isSessionActive]);

  const loadInitialAudio = useCallback(
    async (newIndex: number) => {
      const transcriptText = transcript[newIndex];
      if (!transcriptText) return;

      setIsLoading(true);
      setError(null);

      try {
        let audioUrl = audioCache.get(newIndex);
        if (!audioUrl) {
          const generatedUrl = await generateTTS(transcriptText);
          audioUrl = generatedUrl;
          setAudioCache((prev) => new Map(prev).set(newIndex, generatedUrl));
        }

        const audio = new Audio(audioUrl);
        audio.oncanplaythrough = () => {
          setCurrentAudio(audio);
          setCurrentIndex(newIndex);
          setIsLoading(false);
          setIsHighlightPlayButton(true);
          setIsFirstLoad(false);
        };
        audio.onerror = () => {
          setError("Failed to load audio");
          setIsLoading(false);
          setIsFirstLoad(false);
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "TTS generation failed");
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    },
    [audioCache]
  );

  const playAudioForIndex = useCallback(
    async (newIndex: number) => {
      const transcriptText = transcript[newIndex];
      if (!transcriptText) return;

      setIsLoading(true);
      setError(null);
      if (currentAudio) currentAudio.pause();

      try {
        let audioUrl = audioCache.get(newIndex);
        if (!audioUrl) {
          const generatedUrl = await generateTTS(transcriptText);
          audioUrl = generatedUrl;
          setAudioCache((prev) => new Map(prev).set(newIndex, generatedUrl));
        }

        const audio = new Audio(audioUrl);
        audio.oncanplaythrough = () => {
          setCurrentAudio(audio);
          setCurrentIndex(newIndex);
          audio.play().then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          }).catch((err) => {
            setError("Failed to play audio: " + err.message);
            setIsLoading(false);
          });
        };
        audio.onerror = () => {
          setError("Failed to play audio");
          setIsLoading(false);
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "TTS generation failed");
        setIsLoading(false);
      }
    },
    [audioCache, currentAudio]
  );

  const handleBack = useCallback(() => {
    if (isLoading) return;
    const newIndex = Math.max(currentIndex - 1, 0);
    playAudioForIndex(newIndex);
  }, [currentIndex, isLoading, playAudioForIndex]);

  const handleForward = useCallback(() => {
    if (isLoading) return;
    const newIndex = Math.min(currentIndex + 1, startIndex);
    playAudioForIndex(newIndex);
  }, [currentIndex, startIndex, isLoading, playAudioForIndex]);

  useEffect(() => {
    if (!hasInitialized) {
      loadInitialAudio(0); // Preload first audio
      setHasInitialized(true);
    }
  }, [hasInitialized, loadInitialAudio]);

  const handleTogglePlayPause = () => {
    if (!hasInitialized) return; // Prevent action before initialization

    if (isPlaying) {
      if (currentAudio) {
        setCurrentTime(currentAudio.currentTime); // Save the current position
        currentAudio.pause();
      }
      setIsPlaying(false);
      setIsDoubtState(true);
      toggleMicrophone(true); // Mic on when pausing
    } else {
      // Close WebRTC session and stop microphone
      if (isSessionActive) {
        stopMicrophone();
        doubtSolverRef.current?.stopSession();
        setIsSessionActive(false);
      }
      // Reload audio with loader
      setIsLoading(true);
      playAudioForIndex(currentIndex); // Reload audio from start
      setIsDoubtState(false);
      setIsHighlightPlayButton(false);
    }
  };

  const startSpeechRecognition = (stream: MediaStream) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || isSessionActive) {
      if (!SpeechRecognition) setError("Speech recognition not supported");
      return; // Skip speech recognition if session is active
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join("");
      if (!isSessionActive) {
        setContent(transcript); // Only update input before session starts
      }
    };

    recognition.onerror = (event: SpeechErrorEvent) => {
      setError("Speech recognition error: " + event.error);
      recognition.stop();
    };

    recognition.onend = () => setIsMicActive(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopMicrophone = () => {
    if (microphoneStream) {
      microphoneStream.getTracks().forEach((track) => track.stop());
      setMicrophoneStream(null);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsMicActive(false);
  };

  const toggleMicrophone = async (forceEnable = false) => {
    if (isPlaying && !forceEnable) return;

    if (forceEnable || !isMicActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        setMicrophoneStream(stream);
        setIsMicActive(true);
        if (!isSessionActive) startSpeechRecognition(stream); // Only use speech recognition before session
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to access microphone");
      }
    } else {
      stopMicrophone();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying) setContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isDoubtState && content.trim()) {
      doubtSolverRef.current?.startDoubtSession(content);
      if (!isSessionActive) setIsSessionActive(true); // Start session on first send
      setContent(""); // Clear input after sending
    }
  };

  const handleSendClick = () => {
    if (isDoubtState && content.trim()) {
      doubtSolverRef.current?.startDoubtSession(content);
      if (!isSessionActive) setIsSessionActive(true); // Start session on first send
      setContent(""); // Clear input after sending
    }
  };

  const handleDoubtResolved = (updatedNodes: string[], isComplete: boolean) => {
    if (updatedNodes.length > 0) {
      console.log("Highlighted nodes:", updatedNodes);
    }
  };

  const isBackDisabled = currentIndex === 0 || isLoading;
  const isForwardDisabled = currentIndex === startIndex || isLoading;

  return (
    <div className="flex flex-col h-full w-full gap-2 relative overflow-hidden border border-dashBoardButtonBg rounded-xl bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <Visualiser visualization={visualization as Visualisation} currIndex={currentIndex} />

      <div className="bottom-0 left-0 right-4 flex w-full p-2 items-center gap-2 my-2 z-30">
        <div className="flex gap-2">
          <button
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${activeSideTab === 0 ? "bg-barBgColor" : ""}`}
            onClick={() => handleSideTab(0)}
          >
            <Image src={"/knowledgeGraph.svg"} alt="image" height={40} width={40} className="min-w-[24px] min-h-[24px] w-full" />
          </button>
          <button
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${activeSideTab === 1 ? "bg-barBgColor" : ""}`}
            onClick={() => handleSideTab(1)}
          >
            <Image src={"/QuestionIcon.svg"} alt="image" height={40} width={40} className="min-w-[24px] min-h-[24pxdistance] w-full" />
          </button>
        </div>
        <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
          <div className="flex gap-3 w-full">
            <Image src={"/UploadFileIcon.svg"} alt="image" height={24} width={24} />
            <input
              placeholder={isDoubtState ? "Type your doubt or speak..." : "Ask me anything!"}
              className={`border-none focus:outline-none bg-transparent w-full text-nowrap ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
              onChange={handleInputChange}
              type="text"
              value={content}
              onKeyDown={handleKeyDown}
              disabled={isPlaying}
            />
          </div>
          <Image
            src={"/SendIcon.svg"}
            className={`cursor-pointer ${isPlaying || !isDoubtState ? "opacity-50 pointer-events-none" : ""}`}
            alt="image"
            height={32}
            width={32}
            onClick={handleSendClick}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`p-2 border border-[var(--Border-Secondary)] rounded-lg ${isPlaying ? "opacity-50 cursor-not-allowed" : ""} ${isMicActive ? "text-red-500" : ""} transition-colors relative`}
            onClick={() => toggleMicrophone()}
            disabled={isPlaying}
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
              ${isLoading && isFirstLoad ? "opacity-50 cursor-not-allowed" : ""} 
              ${isPlaying ? "bg-blue-500" : ""} 
              ${!isPlaying && isHighlightPlayButton && !isLoading ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]" : ""}`}
            disabled={isLoading && isFirstLoad}
            onClick={handleTogglePlayPause}
          >
            {isLoading && isFirstLoad ? (
              <div className="loader border-4 border-t-transparent border-gray-300 rounded-full w-6 h-6 animate-spin"></div>
            ) : isPlaying ? (
              <MdPause size="1.3em" />
            ) : (
              <MdPlayArrow size="1.3em" />
            )}
          </button>
          <button
            className="border border-[var(--Border-Secondary)] rounded-lg p-3"
            disabled={isBackDisabled}
            onClick={handleBack}
          >
            <IoIosArrowBack size="1.2em" />
          </button>
          <button
            className="border border-[var(--Border-Secondary)] rounded-lg p-3"
            disabled={isForwardDisabled}
            onClick={handleForward}
          >
            <IoIosArrowForward size="1.2em" />
          </button>
        </div>
      </div>

      <DoubtSolver
        ref={doubtSolverRef}
        topic={currentTopic}
        doubt={content}
        visualizationData={visualization}
        microphoneStream={microphoneStream}
        onComplete={handleDoubtResolved}
      />
    </div>
  );
}