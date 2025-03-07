import React, { useState, useRef, useEffect } from "react";
import { MdClose, MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
import * as d3 from "d3";
import { generateNarrationAudioAPI, processDoubtAPI } from "@/src/services/teachingapi";
import Image from "next/image";

const VisualizationController = ({
  visualizationComponent: VisualizationComponent,
  data,
  topic,
  activeSideTab,
  handleSideTab,
}) => {
  const [highlightedElements, setHighlightedElements] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  // const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [narration, setNarration] = useState("");
  const [originalNarration, setOriginalNarration] = useState("");
  const [isOriginalNarration, setIsOriginalNarration] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [narrationTimestamps, setNarrationTimestamps] = useState([]);
  const [isHighlightPlayButton, setIsHighlightPlayButton] = useState(false);
  const [content, setContent] = useState("");
  // Add new state for caching

  const [originalAudioUrl, setOriginalAudioUrl] = useState(null);
  const [originalTimestamps, setOriginalTimestamps] = useState([]);
  const [originalPlaybackPosition, setOriginalPlaybackPosition] = useState(0);

  // Add new state for enhanced features
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  const [showingExample, setShowingExample] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const visualizationRef = useRef(null);
  const audioRef = useRef(null);
  const playButtonRef = useRef(null);
  const animationFrameRef = useRef(null);

  

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };


  // Initialize narration from data prop
  useEffect(() => {

      const loadNarration = async () => {
        if (data?.narration) {
          setNarration(data.narration);
          setOriginalNarration(data.narration);
          setIsOriginalNarration(true);
          await generateNarrationAudio(data.narration, false); // Wait for audio generation
        }
      };
      loadNarration();
    
  }, [data]);

  
  const generateNarrationAudio = async (text, isOriginal = false) => {
    try {
      setIsLoadingAudio(true);
      const result = await generateNarrationAudioAPI(text, topic);

      console.log("Setting audio URL:", result.audio_url);

      const audioTest = new Audio(result.audio_url);
      await new Promise((resolve, reject) => {
        audioTest.onloadeddata = resolve; // Audio is ready
        audioTest.onerror = () => reject(new Error("Audio failed to load"));
        audioTest.load();
      });

      if (isOriginal) {
        setOriginalAudioUrl(result.audio_url);
        setOriginalTimestamps(result.word_timings || []);
        setAudioUrl(result.audio_url);
        setNarrationTimestamps(result.word_timings || []);
      } else {
        setAudioUrl(result.audio_url);
        setNarrationTimestamps(result.word_timings || []);
      }

      setIsHighlightPlayButton(true); // Trigger highlight
      if (playButtonRef.current) {
        playButtonRef.current.focus(); // Focus the button
      }

      // Optionally remove highlight after a few seconds
      setTimeout(() => setIsHighlightPlayButton(false), 5000);
      
    } catch (error) {
      console.error("Error details:", {
        topic,
        textLength: text?.length,
        error: error.toString(),
      });

      if (isOriginal) {
        setOriginalAudioUrl(null);
        setOriginalTimestamps([]);
      }
      setAudioUrl(null);
      setNarrationTimestamps([]);
      setNarration(
        (prev) => prev + "\n\nError generating audio: " + error.message
      );
    } finally {
      setIsLoadingAudio(false); // Stop loading state
    }
  };
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    setIsHighlightPlayButton(false);
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationFrameRef.current);
      // Store current position if playing original narration
      if (isOriginalNarration) {
        setOriginalPlaybackPosition(audioRef.current.currentTime * 1000);
      }
    } else {
      // If returning to original narration, set the time to stored position
      if (isOriginalNarration && originalPlaybackPosition > 0) {
        audioRef.current.currentTime = originalPlaybackPosition / 1000;
      }
      audioRef.current.play();
      updateHighlights();
    }
    setIsPlaying(!isPlaying);
  };

  const updateHighlights = () => {
    if (!audioRef.current || !narrationTimestamps.length) return;

    const currentTime = audioRef.current.currentTime * 1000; // Convert to milliseconds
    setCurrentTime(currentTime);

    // Find current word timings
    const currentTimings = narrationTimestamps.filter(
      (timing) =>
        currentTime >= timing.start_time && currentTime <= timing.end_time
    );

    // Update highlights based on current timings
    if (currentTimings.length > 0) {
      const elementsToHighlight = currentTimings
        .filter((timing) => timing.node_id) // Only include timings with node_ids
        .map((timing) => ({
          id: timing.node_id,
          type: "highlight",
        }));

      if (elementsToHighlight.length > 0) {
        setHighlightedElements(elementsToHighlight);
      }
    } else {
      // Clear highlights if no current timings
      setHighlightedElements([]);
    }


    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateHighlights);
  };


  const useAudioNarration = (audioRef, narration, narrationTimestamps, isPlaying) => {
    const [currentSubtitle, setCurrentSubtitle] = useState("");
  
    useEffect(() => {
      if (!audioRef.current || !narrationTimestamps.length || !narration || !isPlaying) return;
  
      const paragraphs = narration.split(/\n\s*\n|\n{2,}/).map((p) => p.trim()).filter((p) => p !== "");
  
      const paragraphTimings = [];
      let wordIndex = 0;
  
      paragraphs.forEach((paragraph, i) => {
        const words = paragraph.split(/\s+/);
        const firstWord = words[0];
        const lastWord = words[words.length - 1];
  
        let startTime = null;
        let endTime = null;
  
        for (; wordIndex < narrationTimestamps.length; wordIndex++) {
          const wordObj = narrationTimestamps[wordIndex];
          if (!startTime && wordObj.word === firstWord) {
            startTime = wordObj.start_time - 50; 
          }
          if (wordObj.word === lastWord) {
            endTime = wordObj.end_time + 50; 
            break;
          }
        }
  
        if (startTime !== null && endTime !== null) {
          paragraphTimings.push({ start_time: startTime, end_time: endTime, index: i });
        }
      });
  
      const updateSubtitles = () => {
        if (!audioRef.current) return;
        const currentTime = audioRef.current.currentTime * 1000; 

        const activeParagraph = paragraphTimings.find(
          (p) => currentTime >= p.start_time && currentTime <= p.end_time
        );
  
        if (activeParagraph) {
          setCurrentSubtitle(paragraphs[activeParagraph.index]);
        } else {
          setCurrentSubtitle(""); 
        }
      };
  
      audioRef.current.addEventListener("timeupdate", updateSubtitles);
  
      return () => {
        audioRef.current?.removeEventListener("timeupdate", updateSubtitles);
      };
    }, [audioRef, narration, narrationTimestamps, isPlaying]);
  
    return { currentSubtitle };
  };
  
    const { currentSubtitle } = useAudioNarration(audioRef, narration, narrationTimestamps, isPlaying);

  // Add cleanup for highlights when audio ends or errors
  
  const handleAudioEnd = () => {
    setIsPlaying(false);
    setHighlightedElements([]);
    cancelAnimationFrame(animationFrameRef.current);
  };

  const handleAudioError = (error) => {
    console.error("Audio playback error:", error);
    setIsPlaying(false);
    setAudioUrl(null);
    setHighlightedElements([]); // Clear highlights on error
    // Attempt to regenerate audio
    if (narration) {
      console.log("Attempting to regenerate audio...");
      generateNarrationAudio(narration);
    }
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleRestoreOriginalNarration = () => {
    setNarration(originalNarration);
    setHighlightedElements([]);
    setIsOriginalNarration(true);
    // Use cached original audio if available
    if (originalAudioUrl) {
      setAudioUrl(originalAudioUrl);
      setNarrationTimestamps(originalTimestamps);
      // Reset current playback if audio is not playing
      if (!isPlaying && audioRef.current) {
        audioRef.current.currentTime = originalPlaybackPosition / 1000;
      }
    } else {
      // Regenerate if not cached (shouldn't happen in normal flow)
      generateNarrationAudio(originalNarration, true);
    }
  };

  // const handleDoubtSubmission = async (doubt) => {
  //   try {
  //     if (isPlaying && isOriginalNarration && audioRef.current) {
  //       setOriginalPlaybackPosition(audioRef.current.currentTime * 1000);
  //       audioRef.current.pause();
  //       setIsPlaying(false);
  //     }

  //     setNarration("Processing your question...");

  //     const response = await fetch("https://d259-2401-4900-8821-9282-e9fd-ea41-8b61-864d.ngrok-free.app/api/process-doubt", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         doubt,
  //         topic,
  //         currentState: {
  //           data,
  //           highlightedElements,
  //           currentTime: audioRef.current?.currentTime * 1000 || 0,
  //           isOriginalNarration,
  //           currentNarration: narration,
  //         },
  //         relevantNodes: data.nodes
  //           .filter((node) => highlightedElements.some((h) => h.id === node.id))
  //           .map((node) => ({
  //             id: node.id,
  //             name: node.name,
  //             type: node.type,
  //             properties: node.properties || node.columns,
  //           })),
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.detail || `Server error: ${response.status}`);
  //     }

  //     const result = await response.json();

  //     if (result.error) {
  //       throw new Error(result.error);
  //     }

  //     // Try to parse the response if it's a string
  //     let parsedResult = result;
  //     if (typeof result === "string") {
  //       try {
  //         parsedResult = JSON.parse(result);
  //       } catch (e) {
  //         console.warn("Could not parse response as JSON, using as-is");
  //         parsedResult = { explanation: result };
  //       }
  //     }

  //     // Format the response for better readability
  //     let formattedNarration = "";

  //     // Add the question for context
  //     formattedNarration += `Q: ${doubt}\n\n`;

  //     // Add the main explanation
  //     if (parsedResult.explanation) {
  //       formattedNarration += parsedResult.explanation + "\n\n";
  //     }

  //     // Add any additional context or related information
  //     if (parsedResult.additionalInfo) {
  //       formattedNarration += parsedResult.additionalInfo + "\n\n";
  //     }

  //     // Add component details with improved formatting
  //     if (parsedResult.componentDetails) {
  //       formattedNarration += "Key Components:\n";
  //       Object.entries(parsedResult.componentDetails).forEach(
  //         ([key, value]) => {
  //           formattedNarration += `• ${key}: ${
  //             typeof value === "string" ? value : value.description
  //           }\n`;
  //         }
  //       );
  //       formattedNarration += "\n";
  //     }

  //     // Add examples section
  //     if (parsedResult.examples?.length) {
  //       formattedNarration += "Examples:\n";
  //       parsedResult.examples.forEach((example, i) => {
  //         formattedNarration += `${i + 1}. ${example}\n`;
  //       });
  //       formattedNarration += "\n";
  //     }

  //     // Add recommendations section
  //     if (parsedResult.recommendations?.length) {
  //       formattedNarration += "Recommendations:\n";
  //       parsedResult.recommendations.forEach((rec) => {
  //         formattedNarration += `• ${rec}\n`;
  //       });
  //     }

  //     setNarration(formattedNarration);
  //     setIsOriginalNarration(false);

  //     if (parsedResult.highlightElements) {
  //       setHighlightedElements(parsedResult.highlightElements);
  //     }

  //     if (formattedNarration) {
  //       generateNarrationAudio(formattedNarration, false);
  //     }
  //   } catch (error) {
  //     console.error("Error processing doubt:", error);
  //     setNarration(
  //       `I apologize, but I encountered an error while processing your question:\n${error.message}\n\nPlease try rephrasing your question or ask about a different aspect of the topic.`
  //     );
  //     setIsOriginalNarration(false);
  //   }
  // };


const handleDoubtSubmission = async (doubt) => {
  try {
    if (isPlaying && isOriginalNarration && audioRef.current) {
      setOriginalPlaybackPosition(audioRef.current.currentTime * 1000);
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setNarration("Processing your question...");

    const currentState = {
      data,
      highlightedElements,
      currentTime: audioRef.current?.currentTime * 1000 || 0,
      isOriginalNarration,
      currentNarration: narration,
    };

    const relevantNodes = data.nodes
      .filter((node) => highlightedElements.some((h) => h.id === node.id))
      .map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        properties: node.properties || node.columns,
      }));

    const result = await processDoubtAPI(doubt, topic, currentState, relevantNodes);

    if (result.error) {
      throw new Error(result.error);
    }

    let parsedResult = result;
    if (typeof result === "string") {
      try {
        parsedResult = JSON.parse(result);
      } catch (e) {
        console.warn("Could not parse response as JSON, using as-is");
        parsedResult = { explanation: result };
      }
    }

    let formattedNarration = `Q: ${doubt}\n\n`;

    if (parsedResult.explanation) {
      formattedNarration += parsedResult.explanation + "\n\n";
    }

    if (parsedResult.additionalInfo) {
      formattedNarration += parsedResult.additionalInfo + "\n\n";
    }

    if (parsedResult.componentDetails) {
      formattedNarration += "Key Components:\n";
      Object.entries(parsedResult.componentDetails).forEach(
        ([key, value]) => {
          formattedNarration += `• ${key}: ${
            typeof value === "string" ? value : value.description
          }\n`;
        }
      );
      formattedNarration += "\n";
    }

    if (parsedResult.examples?.length) {
      formattedNarration += "Examples:\n";
      parsedResult.examples.forEach((example, i) => {
        formattedNarration += `${i + 1}. ${example}\n`;
      });
      formattedNarration += "\n";
    }

    if (parsedResult.recommendations?.length) {
      formattedNarration += "Recommendations:\n";
      parsedResult.recommendations.forEach((rec) => {
        formattedNarration += `• ${rec}\n`;
      });
    }

    setNarration(formattedNarration);
    setIsOriginalNarration(false);

    if (parsedResult.highlightElements) {
      setHighlightedElements(parsedResult.highlightElements);
    }

    if (formattedNarration) {
      generateNarrationAudio(formattedNarration, false);
    }
  } catch (error) {
    console.error("Error processing doubt:", error);
    setNarration(
      `I encountered an error while processing your question:\n${error.message}\n\nPlease try rephrasing your question or ask about a different aspect of the topic.`
    );
    setIsOriginalNarration(false);
  }
};

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleDoubtSubmission(content);
      setContent("")
    }
  };

  const handleChange = (e)=>{
    setContent(e);
  }


  // Add components for enhanced features
  // const renderInteractiveElements = () => {
  //   if (!interactiveElements.length) return null;

  //   return (
  //     <div className="interactive-suggestions">
  //       {interactiveElements.map((element, index) => (
  //         <div key={index} className="interactive-suggestion">
  //           <span className={`icon ${element.type}`} />
  //           <span className="message">{element.message}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  // const renderRelatedConcepts = () => {
  //   if (!relatedConcepts.length) return null;

  //   return (
  //     <div className="related-concepts">
  //       <h4>Related Concepts</h4>
  //       <div className="concept-list">
  //         {relatedConcepts.map((concept, index) => (
  //           <button
  //             key={index}
  //             className="concept-button"
  //             onClick={() => handleDoubtSubmission(`Tell me about ${concept}`)}
  //           >
  //             {concept}
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // Add a helper function to format the doubt response
  const formatDoubtResponse = (response) => {
    const { explanation, components, examples, recommendations } = response;
    let formatted = "";

    if (explanation) {
      formatted += `${explanation}\n\n`;
    }

    if (components?.length) {
      formatted += "Key Components:\n";
      components.forEach((comp) => {
        formatted += `• ${comp.name}: ${comp.description}\n`;
      });
      formatted += "\n";
    }

    if (examples?.length) {
      formatted += "Examples:\n";
      examples.forEach((example) => {
        formatted += `• ${example}\n`;
      });
      formatted += "\n";
    }

    if (recommendations?.length) {
      formatted += "Recommendations:\n";
      recommendations.forEach((rec) => {
        formatted += `• ${rec}\n`;
      });
    }

    return formatted;
  };

  // Add debug logging for render
  useEffect(() => {
    console.log("Current state:", {
      hasNarration: Boolean(narration),
      hasAudioUrl: Boolean(audioUrl),
      isOriginalNarration,
      originalPlaybackPosition,
      audioUrl,
      isPlaying,
    });
  }, [
    narration,
    audioUrl,
    isPlaying,
    isOriginalNarration,
    originalPlaybackPosition,
  ]);


  return (
    <div className="visualization-controller ">
      <VisualizationComponent
        data={data}
        highlightedElements={highlightedElements}
        ref={visualizationRef}
      />

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnd}
          onError={handleAudioError}
          style={{ display: "none" }}
          controls
        />
      )}
      {currentSubtitle && (
        <div
          className="side_scroll"
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            maxHeight: "80px",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(32, 32, 32, 0.85)",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "10px",
            textAlign: "left",
            width: "90%",
            maxWidth: "1000px",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "1.4",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            wordBreak: "break-word",
            transition: "opacity 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
          {currentSubtitle}
        </div>
      )}
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
            onClick={()=>{handleDoubtSubmission(content);setContent("")}}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`p-2  border border-[var(--Border-Secondary)] rounded-lg${
              isRecording ? "text-red-500" : ""
            } transition-colors relative`}
            onClick={toggleRecording}
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
          ref={playButtonRef}
            className={`border border-[var(--Border-Secondary)] rounded-lg p-2 
      ${isLoadingAudio ? "opacity-50 cursor-not-allowed" : ""} ${
              isPlaying ? "" : "bg-blue-500"
            } ${isHighlightPlayButton ? "animate-pulse border-red-500 shadow-[0_0_10px_#00ff00]" : ""}
            `}
            onClick={handlePlayPause}
            disabled={isLoadingAudio} 
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
    </div>
  );
};

export default VisualizationController;