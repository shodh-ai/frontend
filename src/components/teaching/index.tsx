"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import NotesSection from "./NotesSection";
import AudioControl from "./AudioControl";
import NotesOverlay from "@/src/components/teaching/Overlay/NotesOverlay";
import { FileModal, ErrorModal, CompletionModal } from "./Modal";
import ControlBar from "./ControlBar";
import ChatOverlay from "./Overlay/ChatOverlay";
import VisualAid from "./VisualAid";
import { Message } from "@/src/models/DoubtModel";
import { getFlowData, getTeachingData } from "@/src/services/flowApi";
import BackgroundBox from "@/src/lib/UI/BackgroundBox";
import KnowledgeGraphMain from "./KnowledgeGraph/KnowledgeGraphMain";
import Image from "next/image";
import DynamicRenderer from "./DynamicRenderer";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
import { getTeachingVisualization } from "@/src/features/studentTeaching/studentTeachingThunks";
import { HierarchicalData } from "@/src/models/studentTeachingModel/TeachingVisualizationData";
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

type SpeechRecognitionErrorEvent = {
  error: string;
  message?: string;
};

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
  onerror: (event: SpeechRecognitionErrorEvent) => void;
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

const Teaching: React.FC = () => {
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  // const [isNotesEnabled, setIsNotesEnabled] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const [activeSideTab, setActiveSideTab] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const userRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const subtitleRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isSubtitlesEnabled = useRef(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [mainConversationHistory, setMainConversationHistory] = useState<
    Message[]
  >([]);
  const [Component, setComponent] = useState<React.FC<{ data: HierarchicalData }> | null>(null);

  const handleSideTab = (index: number) => {
    if (index === 0) {
      setActiveSideTab(index);
    } else {
      setActiveSideTab(index);
      
    }
  };

  const [flowData, setFlowData] = useState<string[]>([]);
  const [visualAid, setVisualAid] = useState("");
  const [currentSubtask, setCurrentSubtask] = useState(0);
  

  const handleSendMessage = async (message: string) => {
    // Add user message to conversation immediately
    const userMessage = { role: "user", content: message };
    setMainConversationHistory((prev) => [...prev, userMessage]);

    try {
      const teachData = await getTeachingData(flowData, currentSubtask + 1, [
        ...mainConversationHistory,
        userMessage,
      ]);
      if (!teachData) {
        throw new Error("Failed to get teaching data");
      }

      console.log("Teach Response:", teachData);

      // Batch state updates together
      const assistantMessage = {
        role: "assistant",
        content: teachData.assistant_reply,
      };

      // Update all states at once to minimize rerenders
      setMainConversationHistory((prev) => [...prev, assistantMessage]);
      setVisualAid(
        teachData.assistant_visual_aid ||
        TeachingVisualData?.jsx_code
      );
      setCurrentSubtask(teachData.current_subtask);
    } catch (error) {
      console.error("Error fetching teach data:", error);
      console.log("Using dummy teach data:", TeachingVisualData);

      // Add dummy response to conversation
      setMainConversationHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: TeachingVisualData?.narration || "",
        },
      ]);
      setVisualAid(TeachingVisualData?.jsx_code || "");
      setCurrentSubtask((prev) => prev + 1);
    }
  };

  // Video subtitles speech recognition setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const latestResult = event.results[event.results.length - 1];
      if (latestResult) {
        const transcript = latestResult[0]?.transcript || "";
        setSubtitles(transcript);
      }
    };

    recognition.onend = () => {
      // Restart subtitles recognition if video is still playing
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        isSubtitlesEnabled.current
      ) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Subtitles recognition restart error:", error);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Subtitles recognition error:", event.error);
    };

    subtitleRecognitionRef.current = recognition;

    return () => {
      if (subtitleRecognitionRef.current) {
        try {
          subtitleRecognitionRef.current.stop();
        } catch (error) {
          console.error("Subtitles recognition cleanup error:", error);
        }
      }
    };
  }, []);

  // User input speech recognition setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const latestResult = event.results[event.results.length - 1];
      if (latestResult && latestResult.isFinal) {
        setTranscript((prev) => prev + latestResult[0]?.transcript + " ");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("User recognition error:", event.error);
      setIsRecording(false);
    };

    userRecognitionRef.current = recognition;

    return () => {
      if (userRecognitionRef.current && isRecording) {
        try {
          userRecognitionRef.current.stop();
        } catch (error) {
          console.error("User recognition cleanup error:", error);
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
            console.error("Subtitles recognition error:", error);
          }
        }
      };

      const handlePause = () => {
        if (subtitleRecognitionRef.current) {
          try {
            isSubtitlesEnabled.current = false;
            subtitleRecognitionRef.current.stop();
          } catch (error) {
            console.error("Subtitles recognition error:", error);
          }
        }
      };

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
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
      console.error("Toggle recording error:", error);
    }
  };

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
    setSubtitles("");
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTeachingVisualization({ topicId: 5 }))
      .unwrap()
      .then()
      .catch((err) => console.error("Error while fetching", err));
  }, [dispatch]);

  const useAudioNarration = (narration: string, isVideoPlaying: boolean) => {
    const [currentSubtitle, setCurrentSubtitle] = useState("");
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
    const queueRef = useRef<string[]>([]); // Stores paragraphs to be spoken
  
    useEffect(() => {
      if (!narration) return;
  
      // Split text into paragraphs (based on newline or full stops)
      queueRef.current = narration.split(/\n|\.\s+/).filter((p) => p.trim() !== "");
  
      const speakNextParagraph = () => {
        if (queueRef.current.length === 0) {
          setCurrentSubtitle(""); // Clear subtitle after last paragraph
          speechRef.current = null;
          return;
        }
  
        const paragraph = queueRef.current.shift(); // Get next paragraph
        if (!paragraph) return;
  
        const speech = new SpeechSynthesisUtterance(paragraph);
        speech.rate = 1;
        speech.pitch = 1;
  
        speech.onstart = () => setCurrentSubtitle(paragraph); // Show full paragraph
        speech.onend = () => speakNextParagraph(); // Move to next paragraph
  
        speechRef.current = speech;
        window.speechSynthesis.speak(speech);
      };
  
      if (isVideoPlaying) {
        speakNextParagraph();
      } else {
        window.speechSynthesis.cancel();
        setCurrentSubtitle("");
        speechRef.current = null;
      }
  
      return () => {
        window.speechSynthesis.cancel();
        speechRef.current = null;
      };
    }, [narration, isVideoPlaying]);
  
    return { currentSubtitle };
  };
  

  const {TeachingVisualData, status} = useAppSelector((state:RootState)=>state.studentTeaching);
  const { currentSubtitle } = useAudioNarration(TeachingVisualData?.narration || "", isVideoPlaying);

  useEffect(() => {
    if (TeachingVisualData) {
      import("./DynamicRenderer")
        .then((mod) => {
          setComponent(() => mod.default);
        })
        .catch((err) => {
          console.error("Error loading DynamicRenderer:", err);
        });
    }
  }, [TeachingVisualData]);

  return (
    <div className="h-full flex gap-3 w-full p-8">
      {activeSideTab != -1 && (
        <div className="border flex flex-col min-h-[664px] gap-3 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white w-full max-w-[300px]">
          {activeSideTab === 0 ? (
            <KnowledgeGraphMain setActiveSideTab={setActiveSideTab} />
          ) : activeSideTab === 1 ? (
            <NotesOverlay
              // isVisible={isNotesEnabled}
              // setIsNotesEnabled={setIsNotesEnabled}
              setIsFileModalOpen={setIsFileModalOpen}
              handleVideoToggle={handleVideoToggle}
              mainConversationHistory={mainConversationHistory}
              conversationHistory={conversationHistory}
              setConversationHistory={setConversationHistory}
              setActiveSideTab={setActiveSideTab}
            />
           ) : null} 
        </div>
      )}
      
      <div className="relative border border-[var(--Border-Secondary)] p-5 h-full w-full overflow-hidden rounded-xl bg-black">
        <div className="absolute inset-0 bottom-20 flex">
          {status === "loading" && <div className="flex justify-center text-center">Loading...</div>}

          <div style={{ height: "100%", width: "100%" }}>
            {TeachingVisualData && (
              <Suspense fallback={<p style={{ color: "white", textAlign: "center" }}>⏳ Loading...</p>}>
                <DynamicRenderer data={TeachingVisualData} isVideoPlaying={isVideoPlaying} />
              </Suspense>
            )}
          </div>

          {currentSubtitle && (
            <div
              style={{
                position: "absolute",
                bottom: "15px", // Close to the bottom but not touching
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(32, 32, 32, 0.85)", // Dark gray with slight transparency
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "10px", // Matches the smooth UI feel
                textAlign: "left", // Align text left for a chat-like effect
                width: "90%",
                maxWidth: "700px", // Matches the image's aspect ratio
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "1.4",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Light depth effect
                wordBreak: "break-word", // Prevents text from overflowing
                transition: "opacity 0.3s ease-in-out", // Smooth fade-in effect
              }}
            >
              {currentSubtitle}
            </div>
          )}


        </div>

        
        <AudioControl mainConversationHistory={mainConversationHistory}/>
        
        <ChatOverlay
          isVisible={!isVideoPlaying}
          onClose={handleVideoToggle}
          conversationHistory={conversationHistory}
          mainConversationHistory={mainConversationHistory}
          setMainConversationHistory={setMainConversationHistory}
          onSendMessage={handleSendMessage}
        />

        <div className="absolute bottom-0 left-0 right-0 flex w-full p-2 items-center gap-2 my-2 z-30">
          <div className="flex gap-2">
            <button
              className={`border border-[var(--Border-Secondary)] rounded-lg p-2 ${
                activeSideTab === 0 ? "bg-barBgColor" : ""
              }`}
              onClick={() => handleSideTab(0)}
            >
              <Image
                src={"/KnowledgeGraphIcon.svg"}
                color="#C7CCF8"
                style={{ color: "#C7CCF8" }}
                alt="image"
                height={24}
                width={24}
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
                height={24}
                width={24}
              />
            </button>
          </div>
          <ControlBar
            isVideoPlaying={isVideoPlaying}
            isRecording={isRecording}
            transcript={transcript}
            handleVideoToggle={handleVideoToggle}
            toggleRecording={toggleRecording}
            setTranscript={setTranscript}
            setIsFileModalOpen={setIsFileModalOpen}
            setShowErrorModal={setShowErrorModal}
            conversationHistory={conversationHistory}
            mainConversationHistory={mainConversationHistory}
            setMainConversationHistory={setMainConversationHistory}
            onSendMessage={handleSendMessage}
          />
        </div>

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
    </div>
  );
};

export default Teaching;
