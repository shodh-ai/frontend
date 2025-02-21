"use client";
import React, { useState, useRef, useEffect } from "react";
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

interface Node {
  id: string;
  name: string;
  type: string;
  properties: string[];
}

interface Edge {
  source: string;
  target: string;
  type: string;
  description: string;
}

interface HierarchicalData {
  data: {
    nodes: Node[];
    edges: Edge[];
  };
  jsx_code: string;
}

const hierarchicalData: HierarchicalData = {
  data: {
    nodes: [
      {
        id: "root",
        name: "University",
        type: "root",
        properties: ["institution_id", "name", "location"],
      },
      {
        id: "college",
        name: "College",
        type: "branch",
        properties: ["college_id", "name", "dean"],
      },
      {
        id: "department",
        name: "Department",
        type: "branch",
        properties: ["dept_id", "name", "head"],
      },
      {
        id: "course",
        name: "Course",
        type: "leaf",
        properties: ["course_id", "title", "credits"],
      },
      {
        id: "faculty",
        name: "Faculty",
        type: "leaf",
        properties: ["faculty_id", "name", "rank"],
      },
    ],
    edges: [
      {
        source: "root",
        target: "college",
        type: "parent_child",
        description: "University contains multiple colleges",
      },
      {
        source: "college",
        target: "department",
        type: "parent_child",
        description: "College contains multiple departments",
      },
      {
        source: "department",
        target: "course",
        type: "parent_child",
        description: "Department offers multiple courses",
      },
      {
        source: "department",
        target: "faculty",
        type: "parent_child",
        description: "Department has multiple faculty members",
      },
    ],
  },
  jsx_code: `
const HierarchicalVisualization = ({ data }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!data || !data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0 ||
        !data.edges || !Array.isArray(data.edges)) {
      console.error('Invalid data format for hierarchical visualization');
      return;
    }

    const container = d3.select(containerRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const nodeWidth = 200;
    const nodeHeight = 140;
    const levelHeight = 180;

    // Clear any existing SVG
    container.selectAll('*').remove();

    // Create SVG with zoom support
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);

    // Create a container for the zoomable content
    const g = svg.append('g')
      .attr('transform', 'translate(' + (width / 2) + ',50)');

    // Find root node
    const rootNode = data.nodes.find(n => n && n.id === 'root');
    if (!rootNode) {
      console.error('Root node not found in hierarchical data');
      return;
    }

    // Helper function to create hierarchy
    function createHierarchy(nodes, edges, parentId) {
      const nodeMap = new Map(nodes.map(n => [n.id, { ...n, children: [] }])); 
      const children = [];

      edges.forEach(edge => {
        if (edge.source === parentId) {
          const child = nodeMap.get(edge.target);
          if (child) {
            child.children = createHierarchy(nodes, edges, child.id);
            children.push(child);
          }
        }
      });

      return children;
    }

    // Create the hierarchy
    const hierarchy = d3.hierarchy({
      ...rootNode,
      children: createHierarchy(data.nodes, data.edges, rootNode.id)
    }, d => d.children);

    // Create tree layout
    const treeLayout = d3.tree()
      .nodeSize([nodeWidth + 60, levelHeight]);

    // Apply layout
    const root = treeLayout(hierarchy);

    // Create curved links
    const link = g.selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d => {
        const source = d.source;
        const target = d.target;
        const midY = (source.y + target.y) / 2;
        return 'M' + source.x + ',' + source.y +
               ' C' + source.x + ',' + midY +
               ' ' + target.x + ',' + midY +
               ' ' + target.x + ',' + target.y;
      })
      .style('fill', 'none')
      .style('stroke', '#3b82f6')
      .style('stroke-width', '2px')
      .style('stroke-opacity', 0.8);

    // Create node containers
    const node = g.selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .on('click', (event, d) => onNodeClick && onNodeClick(d.data));

    // Add node rectangles
    node.append('rect')
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('fill', d => {
        switch (d.data.type) {
          case 'root': return '#2563eb';
          case 'branch': return '#3b82f6';
          default: return '#60a5fa';
        }
      })
      .style('stroke', '#60a5fa')
      .style('stroke-width', '2px')
      .style('cursor', 'pointer');

    // Add node headers
    node.append('rect')
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
      .attr('width', nodeWidth)
      .attr('height', 30)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('fill', d => {
        switch (d.data.type) {
          case 'root': return '#1e40af';
          case 'branch': return '#1d4ed8';
          default: return '#2563eb';
        }
      })
      .style('cursor', 'pointer');

    // Add node titles
    node.append('text')
      .attr('x', 0)
      .attr('y', -nodeHeight / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .text(d => d.data.name);

    // Add node properties
    node.each(function (d) {
      const properties = d.data.properties || [];
      const nodeGroup = d3.select(this);

      properties.forEach((prop, i) => {
        nodeGroup.append('text')
          .attr('x', -nodeWidth / 2 + 10)
          .attr('y', -nodeHeight / 2 + 50 + i * 20)
          .style('fill', 'white')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .text(prop);
      });
    });

    // Add relationship labels
    link.each(function (d) {
      const relationship = data.edges.find(e =>
        e.source === d.source.data.id &&
        e.target === d.target.data.id
      );

      if (relationship) {
        const path = d3.select(this);
        const pathNode = path.node();
        const midpoint = pathNode.getPointAtLength(pathNode.getTotalLength() * 0.5);

        g.append('text')
          .attr('x', midpoint.x)
          .attr('y', midpoint.y - 10)
          .attr('text-anchor', 'middle')
          .style('fill', '#1e40af')
          .style('font-weight', 'bold')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .text(relationship.description);
      }
    });

    // Center the visualization
    const bounds = g.node().getBBox();
    const scale = Math.min(
      width / bounds.width,
      height / bounds.height
    ) * 0.9;

    const transform = d3.zoomIdentity
      .translate(
        width / 2 - (bounds.x + bounds.width / 2) * scale,
        height / 2 - (bounds.y + bounds.height / 2) * scale
      )
      .scale(scale);

    svg.call(zoom.transform, transform);

  }, [data]);

  return React.createElement("div", { ref: containerRef, style: { width: "100%", height: "100%" } });
};


// Assign to global variable so it's accessibl
window.HierarchicalVisualization = HierarchicalVisualization;`,
};

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
  const DUMMY_TEACH_RESPONSE = {
    assistant_reply:
      "Let's get started with understanding entities using the visual aid provided: - In the **top-left quadrant**, you'll find the definition of an entity, highlighting its importance in databases as a distinct object that can be stored and identified. - The **top-right quadrant** presents an image diagram that visually explains how entities are represented within a database framework. - The **bottom-left quadrant** gives a simple example, using 'Student' as an entity in a school database, which shows how entities are relatable structures within databases. - Finally, the **bottom-right quadrant** uses a real-world analogy to equate entities to tangible objects like a car, a book, or a person, which have unique attributes and can be uniquely identified. This should lay a solid foundation for your understanding of entities in a database system.",
    assistant_visual_aid:
      "<div class='grid'><div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'><p class='text-white font-medium mb-2'>Definition:</p><p class='text-white/80'>An entity is a distinct object or item that can be identified and stored in a database.</p></div><div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'><p class='text-white font-medium mb-2'>Image:</p><img src='https://example.com/entity-diagram.jpg' alt='Entity Diagram' class='w-full h-auto rounded'/></div><div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'><p class='text-white font-medium mb-2'>Example:</p><p class='text-white/80'>A 'Student' as an entity in a school database.</p></div><div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'><p class='text-white font-medium mb-2'>Real-World Analogy:</p><p class='text-white/80'>Comparing entities to objects like a car, a book, or a person, which have distinct characteristics and can exist independently.</p></div></div>",
    current_subtask: 0,
    doubt_chat_state: true,
  };

  const DUMMY_FLOW_DATA = {
    teaching_flow: [
      "Step 1: Introduce the concept of quantum computing as a new way of processing information using quantum bits or qubits.",
      "Step 2: Explain the differences between classical computing and quantum computing in terms of how they store and manipulate data.",
      "Step 3: Discuss the concept of superposition in quantum computing and how it allows qubits to exist in multiple states simultaneously.",
      "Step 4: Describe the idea of entanglement in quantum computing where qubits can be correlated with each other regardless of distance.",
      "Step 5: Show how quantum algorithms like Shor's algorithm and Grover's algorithm can solve problems much faster than classical algorithms.",
      "Step 6: Connect quantum computing to artificial intelligence by explaining how quantum algorithms can be used to optimize machine learning models.",
      "Step 7: Discuss the potential applications of quantum computing in AI, such as speeding up neural network training and improving optimization algorithms.",
      "Step 8: Provide examples of current research and development in the field of quantum computing for AI, showcasing the progress being made in this interdisciplinary area.",
    ],
  };

  const handleSideTab = (index: number) => {
    if (index === 0) {
      setActiveSideTab(index);
    } else {
      setActiveSideTab(index);
      // setIsNotesEnabled(!isNotesEnabled);
      // handleVideoToggle()
    }
  };

  const [flowData, setFlowData] = useState<string[]>([]);
  const [visualAid, setVisualAid] = useState("");
  const [currentSubtask, setCurrentSubtask] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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
          DUMMY_TEACH_RESPONSE.assistant_visual_aid
      );
      setCurrentSubtask(teachData.current_subtask);
    } catch (error) {
      console.error("Error fetching teach data:", error);
      console.log("Using dummy teach data:", DUMMY_TEACH_RESPONSE);

      // Add dummy response to conversation
      setMainConversationHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: DUMMY_TEACH_RESPONSE.assistant_reply,
        },
      ]);
      setVisualAid(DUMMY_TEACH_RESPONSE.assistant_visual_aid);
      setCurrentSubtask((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Get flow data first
        let flowResponse = await getFlowData();
        if (!Array.isArray(flowResponse) || flowResponse.length === 0) {
          console.log("Using dummy flow data:", DUMMY_FLOW_DATA);
          flowResponse = DUMMY_FLOW_DATA.teaching_flow;
        }

        setFlowData(flowResponse);

        // Then get teaching data using the flow
        const teachData = await getTeachingData(flowResponse, 0, []);
        if (!teachData) {
          console.log("Using dummy teach data:", DUMMY_TEACH_RESPONSE);
          setVisualAid(DUMMY_TEACH_RESPONSE.assistant_visual_aid);
          if (mainConversationHistory.length === 0) {
            setMainConversationHistory([
              {
                role: "assistant",
                content: DUMMY_TEACH_RESPONSE.assistant_reply,
              },
            ]);
          }
        } else {
          setVisualAid(
            teachData.assistant_visual_aid ||
              DUMMY_TEACH_RESPONSE.assistant_visual_aid
          );
          if (mainConversationHistory.length === 0) {
            setMainConversationHistory([
              {
                role: "assistant",
                content: teachData.assistant_reply,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        console.error("Error initializing data:", error);
        // Use dummy data as fallback without showing error state
        setHasError(false); // Don't show error since we're falling back to dummy data
        setFlowData(DUMMY_FLOW_DATA.teaching_flow);
        setVisualAid(DUMMY_TEACH_RESPONSE.assistant_visual_aid);
        if (mainConversationHistory.length === 0) {
          setMainConversationHistory([
            {
              role: "assistant",
              content: DUMMY_TEACH_RESPONSE.assistant_reply,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (mainConversationHistory.length === 0) {
      initializeData();
    }
  }, []);
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

  // useEffect(() => {
  //   const savedConversationHistory = localStorage.getItem(
  //     "conversationHistory"
  //   );
  //   const savedmainConversationHistory = localStorage.getItem(
  //     "mainConversationHistory"
  //   );
  //   if (savedConversationHistory) {
  //     setConversationHistory(JSON.parse(savedConversationHistory));
  //   }
  //   if (savedmainConversationHistory) {
  //     setMainConversationHistory(JSON.parse(savedmainConversationHistory));
  //   }
  // }, [act]);

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
      <div className="relative border border-[var(--Border-Secondary)]  p-5 h-full w-full overflow-hidden rounded-xl bg-black ">
        <div className="absolute inset-0 bottom-20 flex ">
          {/* {mainConversationHistory.length > 0 ? (
            <VisualAid
              visualAid={
                visualAid ||
                '<div class="text-white p-4">No visual aid available</div>'
              }
              assistantReply={
                mainConversationHistory[mainConversationHistory.length - 1]
                  .content
              }
              onNarrationComplete={() => {
                console.log("Narration completed for subtask:", currentSubtask);
                // Auto-start next narration
                setIsVideoPlaying(true);
              }}
              flowData={flowData}
              currentSubtask={currentSubtask}
              conversationHistory={mainConversationHistory.map(
                (msg) => msg.content
              )}
              onTeachingDataReceived={(teachData) => {
                if (teachData) {
                  console.log("Received next teaching data:", teachData);
                  const parsedTeachData =
                    typeof teachData === "string"
                      ? JSON.parse(teachData)
                      : teachData;

                  setMainConversationHistory((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      content: parsedTeachData.assistant_reply,
                    },
                  ]);

                  setVisualAid(parsedTeachData.assistant_visual_aid);
                  setCurrentSubtask(parsedTeachData.current_subtask);
                  // Auto-play when new content arrives
                  setIsVideoPlaying(true);
                }
              }}
              isVideoPlaying={isVideoPlaying}
            />
          ) : (
            <div className="text-white p-4">Loading...</div>
          )} */}

          <div style={{ height: "100%", width: "100%" }}>
            <p>✅ Hierarchical Visualization Component Rendered</p>
            <DynamicRenderer data={hierarchicalData} />
          </div>
        </div>

        <AudioControl mainConversationHistory={mainConversationHistory} />
        {/* 
        <ChatOverlay
          isVisible={!isVideoPlaying}
          onClose={handleVideoToggle}
          conversationHistory={conversationHistory}
          mainConversationHistory={mainConversationHistory}
          setMainConversationHistory={setMainConversationHistory}
          onSendMessage={handleSendMessage}
        /> */}

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
          {/* <NotesSection
            isNotesEnabled={isNotesEnabled}
            setIsNotesEnabled={setIsNotesEnabled}
            handleVideoToggle={handleVideoToggle}
          /> */}
        </div>

        {/* {isNotesEnabled && (
          <NotesOverlay
            isVisible={isNotesEnabled}
            setIsNotesEnabled={setIsNotesEnabled}
            setIsFileModalOpen={setIsFileModalOpen}
            handleVideoToggle={handleVideoToggle}
            mainConversationHistory={mainConversationHistory}
            conversationHistory={conversationHistory}
            setConversationHistory={setConversationHistory}
            setActiveSideTab={setActiveSideTab}
          />
        )} */}

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

// import React from "react";
// import DynamicRenderer from "./DynamicRenderer";
// interface Node {
//   id: string;
//   name: string;
//   type: string;
//   properties: string[];
// }

// interface Edge {
//   source: string;
//   target: string;
//   type: string;
//   description: string;
// }

// interface HierarchicalData {
//   data: {
//     nodes: Node[];
//     edges: Edge[];
//   };
//   jsx_code: string;
// }

// const Teaching: React.FC = () => {
//   const hierarchicalData: HierarchicalData = {
//     data: {
//       nodes: [
//         {
//           id: "root",
//           name: "University",
//           type: "root",
//           properties: ["institution_id", "name", "location"],
//         },
//         {
//           id: "college",
//           name: "College",
//           type: "branch",
//           properties: ["college_id", "name", "dean"],
//         },
//         {
//           id: "department",
//           name: "Department",
//           type: "branch",
//           properties: ["dept_id", "name", "head"],
//         },
//         {
//           id: "course",
//           name: "Course",
//           type: "leaf",
//           properties: ["course_id", "title", "credits"],
//         },
//         {
//           id: "faculty",
//           name: "Faculty",
//           type: "leaf",
//           properties: ["faculty_id", "name", "rank"],
//         },
//       ],
//       edges: [
//         {
//           source: "root",
//           target: "college",
//           type: "parent_child",
//           description: "University contains multiple colleges",
//         },
//         {
//           source: "college",
//           target: "department",
//           type: "parent_child",
//           description: "College contains multiple departments",
//         },
//         {
//           source: "department",
//           target: "course",
//           type: "parent_child",
//           description: "Department offers multiple courses",
//         },
//         {
//           source: "department",
//           target: "faculty",
//           type: "parent_child",
//           description: "Department has multiple faculty members",
//         },
//       ],
//     },
//     jsx_code: `
// const HierarchicalVisualization = ({ data }) => {
//   const containerRef = React.useRef(null);

//   React.useEffect(() => {
//     if (!data || !data.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0 ||
//         !data.edges || !Array.isArray(data.edges)) {
//       console.error('Invalid data format for hierarchical visualization');
//       return;
//     }

//     const container = d3.select(containerRef.current);
//     const width = containerRef.current.clientWidth;
//     const height = containerRef.current.clientHeight;
//     const nodeWidth = 200;
//     const nodeHeight = 140;
//     const levelHeight = 180;

//     // Clear any existing SVG
//     container.selectAll('*').remove();

//     // Create SVG with zoom support
//     const svg = container.append('svg')
//       .attr('width', width)
//       .attr('height', height);

//     // Add zoom behavior
//     const zoom = d3.zoom()
//       .scaleExtent([0.1, 2])
//       .on('zoom', (event) => g.attr('transform', event.transform));

//     svg.call(zoom);

//     // Create a container for the zoomable content
//     const g = svg.append('g')
//       .attr('transform', 'translate(' + (width / 2) + ',50)');

//     // Find root node
//     const rootNode = data.nodes.find(n => n && n.id === 'root');
//     if (!rootNode) {
//       console.error('Root node not found in hierarchical data');
//       return;
//     }

//     // Helper function to create hierarchy
//     function createHierarchy(nodes, edges, parentId) {
//       const nodeMap = new Map(nodes.map(n => [n.id, { ...n, children: [] }]));
//       const children = [];

//       edges.forEach(edge => {
//         if (edge.source === parentId) {
//           const child = nodeMap.get(edge.target);
//           if (child) {
//             child.children = createHierarchy(nodes, edges, child.id);
//             children.push(child);
//           }
//         }
//       });

//       return children;
//     }

//     // Create the hierarchy
//     const hierarchy = d3.hierarchy({
//       ...rootNode,
//       children: createHierarchy(data.nodes, data.edges, rootNode.id)
//     }, d => d.children);

//     // Create tree layout
//     const treeLayout = d3.tree()
//       .nodeSize([nodeWidth + 60, levelHeight]);

//     // Apply layout
//     const root = treeLayout(hierarchy);

//     // Create curved links
//     const link = g.selectAll('.link')
//       .data(root.links())
//       .join('path')
//       .attr('class', 'link')
//       .attr('d', d => {
//         const source = d.source;
//         const target = d.target;
//         const midY = (source.y + target.y) / 2;
//         return 'M' + source.x + ',' + source.y +
//                ' C' + source.x + ',' + midY +
//                ' ' + target.x + ',' + midY +
//                ' ' + target.x + ',' + target.y;
//       })
//       .style('fill', 'none')
//       .style('stroke', '#3b82f6')
//       .style('stroke-width', '2px')
//       .style('stroke-opacity', 0.8);

//     // Create node containers
//     const node = g.selectAll('.node')
//       .data(root.descendants())
//       .join('g')
//       .attr('class', 'node')
//       .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
//       .on('click', (event, d) => onNodeClick && onNodeClick(d.data));

//     // Add node rectangles
//     node.append('rect')
//       .attr('x', -nodeWidth / 2)
//       .attr('y', -nodeHeight / 2)
//       .attr('width', nodeWidth)
//       .attr('height', nodeHeight)
//       .attr('rx', 10)
//       .attr('ry', 10)
//       .style('fill', d => {
//         switch (d.data.type) {
//           case 'root': return '#2563eb';
//           case 'branch': return '#3b82f6';
//           default: return '#60a5fa';
//         }
//       })
//       .style('stroke', '#60a5fa')
//       .style('stroke-width', '2px')
//       .style('cursor', 'pointer');

//     // Add node headers
//     node.append('rect')
//       .attr('x', -nodeWidth / 2)
//       .attr('y', -nodeHeight / 2)
//       .attr('width', nodeWidth)
//       .attr('height', 30)
//       .attr('rx', 10)
//       .attr('ry', 10)
//       .style('fill', d => {
//         switch (d.data.type) {
//           case 'root': return '#1e40af';
//           case 'branch': return '#1d4ed8';
//           default: return '#2563eb';
//         }
//       })
//       .style('cursor', 'pointer');

//     // Add node titles
//     node.append('text')
//       .attr('x', 0)
//       .attr('y', -nodeHeight / 2 + 20)
//       .attr('text-anchor', 'middle')
//       .style('fill', 'white')
//       .style('font-weight', 'bold')
//       .style('font-size', '14px')
//       .style('pointer-events', 'none')
//       .text(d => d.data.name);

//     // Add node properties
//     node.each(function (d) {
//       const properties = d.data.properties || [];
//       const nodeGroup = d3.select(this);

//       properties.forEach((prop, i) => {
//         nodeGroup.append('text')
//           .attr('x', -nodeWidth / 2 + 10)
//           .attr('y', -nodeHeight / 2 + 50 + i * 20)
//           .style('fill', 'white')
//           .style('font-size', '12px')
//           .style('pointer-events', 'none')
//           .text(prop);
//       });
//     });

//     // Add relationship labels
//     link.each(function (d) {
//       const relationship = data.edges.find(e =>
//         e.source === d.source.data.id &&
//         e.target === d.target.data.id
//       );

//       if (relationship) {
//         const path = d3.select(this);
//         const pathNode = path.node();
//         const midpoint = pathNode.getPointAtLength(pathNode.getTotalLength() * 0.5);

//         g.append('text')
//           .attr('x', midpoint.x)
//           .attr('y', midpoint.y - 10)
//           .attr('text-anchor', 'middle')
//           .style('fill', '#1e40af')
//           .style('font-weight', 'bold')
//           .style('font-size', '12px')
//           .style('pointer-events', 'none')
//           .text(relationship.description);
//       }
//     });

//     // Center the visualization
//     const bounds = g.node().getBBox();
//     const scale = Math.min(
//       width / bounds.width,
//       height / bounds.height
//     ) * 0.9;

//     const transform = d3.zoomIdentity
//       .translate(
//         width / 2 - (bounds.x + bounds.width / 2) * scale,
//         height / 2 - (bounds.y + bounds.height / 2) * scale
//       )
//       .scale(scale);

//     svg.call(zoom.transform, transform);

//   }, [data]);

//   return React.createElement("div", { ref: containerRef, style: { width: "100%", height: "100%" } });
// };

// // Assign to global variable so it's accessibl
// window.HierarchicalVisualization = HierarchicalVisualization;`,
//   };

//   return (
//     <div style={{height:'100vh', width:"auto"}}>
//        <p>✅ Hierarchical Visualization Component Rendered</p>
//       <DynamicRenderer data={hierarchicalData} />
//     </div>
//   );
// };
// export default Teaching;
