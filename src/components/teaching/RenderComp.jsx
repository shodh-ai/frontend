"use client";
import React, { useState, useRef, useEffect } from "react";
// import DoubtBox from './DoubtBox';
// import ERVisualization from './ERVisualization';
// import DocumentVisualization from './DocumentVisualization';

// import HierarchicalVisualization from './HierarchicalVisualization';
// import EntityVisualization from './EntityVisualization';
// import AttributeVisualization from './AttributeVisualization';
import SharedMemoryVisualization from "./SharedMemoryLocation";
// import SharedDiskVisualization from './Shared_diskVisualization';
// import SharedNothingVisualization from './Shared_nothingVisualization';
// import DistributedDatabaseVisualization from './Distributed_databaseVisualization';
// import OOPConceptsVisualization from './Oop_conceptsVisualization';
// import RelationalQueryVisualization from './RelationalqueryVisualization';
// import NormalFormVisualization from './NormalizationVisualization';
// import ActiveDBVisualization from './ActivedbVisualization';
// import QueryProcessingVisualization from './QueryprocessingVisualization';
// import MobiledbVisualization from './MobiledbVisualization';
// import GISVisualization from './GisVisualization';
import VisualizationController from "./VisualizationController";
import { fetchVisualizationAPI } from "@/src/services/teachingapi";

// Define the VISUALIZATIONS object
const VISUALIZATIONS = {
  // er: ERVisualization,
  // document: DocumentVisualization,
  // hierarchical: HierarchicalVisualization,
  // entity: EntityVisualization,
  // attribute: AttributeVisualization,
  shared_memory: SharedMemoryVisualization,
  // shared_disk: SharedDiskVisualization,
  // shared_nothing: SharedNothingVisualization,
  // distributed_database: DistributedDatabaseVisualization,
  // oop_concepts: OOPConceptsVisualization,
  // relationalQuery: RelationalQueryVisualization,
  // normalization: NormalFormVisualization,
  // activedb: ActiveDBVisualization,
  // queryprocessing: QueryProcessingVisualization,
  // mobiledb: MobiledbVisualization,
  // gis: GISVisualization
};

export default function RenderComponent({ handleSideTab, activeSideTab }) {
  const [topic, setTopic] = useState("shared_memory");
  const [data, setData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [animationStates, setAnimationStates] = useState([]);
  const [activeHighlights, setActiveHighlights] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [narration, setNarration] = useState("");
  const [isProcessingDoubt, setIsProcessingDoubt] = useState(false);
  const visualizationRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     if (!topic) return;

  //     setLoading(true);
  //     setError(null);

  //     fetch(
  //       `${baseUrl}/api/visualization`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ topic }),
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((result) => {
  //         setData(result);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setError(err.message);
  //         setLoading(false);
  //       });
  //   }, [topic]);

  useEffect(() => {
    if (!topic) return;

    setLoading(true);
    setError(null);
    setData(null);

    fetchVisualizationAPI(topic)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [topic]);
  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleDoubtSubmit = async (doubt) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/process-doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doubt, topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to process doubt");
      }

      const result = await response.json();
      // Extract the narration text from the response
      const narrationText =
        typeof result.narration === "string"
          ? result.narration
          : result.narration?.explanation || "No explanation available";

      setNarration(narrationText);
      if (result.highlightedElements) {
        setActiveHighlights(new Set(result.highlightedElements));
      }
    } catch (err) {
      setError("Failed to process your doubt. Please try again.");
      console.error("Error processing doubt:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (nodeId) => {
    console.log("Clicked node:", nodeId);
    if (visualizationRef.current?.highlightNode) {
      visualizationRef.current.highlightNode(nodeId);
      setTimeout(() => {
        visualizationRef.current?.resetHighlights();
      }, 2000);
    }
  };

  const updateHighlights = (time) => {
    if (!data?.narration_timestamps) {
      console.log("No narration timestamps available for highlighting");
      return;
    }

    // Reset all highlights first
    visualizationRef.current?.resetHighlights();

    // Find current narration segment
    const currentSegment = data.narration_timestamps.find(
      (segment) => time >= segment.start_time && time <= segment.end_time
    );

    console.log("Current time:", time, "Current segment:", currentSegment);

    if (currentSegment) {
      // Handle both single node_id and array of node_ids
      const nodeIds =
        currentSegment.node_ids ||
        (currentSegment.node_id ? [currentSegment.node_id] : []);

      console.log("Highlighting nodes:", nodeIds);

      // Apply highlights to current nodes
      nodeIds.forEach((nodeId) => {
        if (nodeId) {
          visualizationRef.current?.highlightNode(nodeId);
        }
      });
      setActiveHighlights(new Set(nodeIds));
    } else {
      console.log("No active segment found for time:", time);
      setActiveHighlights(new Set());
    }
  };

  const animate = () => {
    if (!isPlaying) {
      console.log("Animation stopped - not playing");
      return;
    }

    const timestamps = data?.narration_timestamps;
    if (!timestamps?.length) {
      console.log("No narration timestamps available");
      setIsPlaying(false);
      return;
    }

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    console.log("Current time:", elapsed, "ms");

    // Update current time
    setCurrentTime(elapsed);

    // Find current word timing
    const currentTiming = timestamps.find(
      (timing) => elapsed >= timing.start_time && elapsed <= timing.end_time
    );

    if (currentTiming) {
      // Update highlights based on current timing
      if (visualizationRef.current?.highlightNode) {
        visualizationRef.current.resetHighlights();
        currentTiming.node_ids.forEach((nodeId) => {
          visualizationRef.current.highlightNode(nodeId);
        });
      }
    }

    // Check if animation should end
    const lastTiming = timestamps[timestamps.length - 1];
    if (elapsed > lastTiming.end_time) {
      setIsPlaying(false);
      if (visualizationRef.current?.resetHighlights) {
        visualizationRef.current.resetHighlights();
      }
      return;
    }

    // Continue animation
    timerRef.current = requestAnimationFrame(animate);
    if (elapsed >= lastSegment.end_time) {
      console.log("Animation complete");
      setIsPlaying(false);
      setCurrentTime(lastSegment.end_time);
      updateHighlights(lastSegment.end_time);
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
      return;
    }

    setCurrentTime(elapsed);
    updateHighlights(elapsed);
    timerRef.current = requestAnimationFrame(animate);
  };

  // Effect to update highlights when currentTime changes
  useEffect(() => {
    if (data?.narration_timestamps) {
      updateHighlights(currentTime);
    }
  }, [currentTime, data]);

  const handlePlayPause = () => {
    console.log("Play/Pause clicked, current state:", isPlaying);
    if (isPlaying) {
      // Pause animation
      console.log("Pausing animation");
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
      setIsPlaying(false);
    } else {
      // Start/resume animation
      console.log("Starting animation");
      startTimeRef.current = Date.now() - currentTime;
      setIsPlaying(true);
      animate(); // Start animation
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  // Reset animation when topic changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
  }, [topic]);

  useEffect(() => {
    if (data?.narration_timestamps) {
      // Reset animation when data changes
      setCurrentTime(0);
      setIsPlaying(false);
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    }
  }, [data]);

  const renderVisualization = () => {
    if (loading) {
        return (
            <div className="h-full">
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="loader flex flex-col items-center gap-2">
              <div className="spinner border-4 border-t-blue-500 border-gray-200 rounded-full w-7 h-7 animate-spin"></div>
              <span className="text-white text-lg">Loading Visualization...</span>
            </div>
          </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="error-container flex items-center justify-center h-full text-red-500">
            Error: {error}
          </div>
        );
      }
    if (!data || !topic) return null;


    // Use VisualizationController for shared memory and shared disk visualizations
    if (
      topic === "shared_memory" ||
      topic === "shared_disk" ||
      topic === "shared_nothing"
    ) {
      return (
        <VisualizationController
          visualizationComponent={VISUALIZATIONS[topic]}
          data={data}
          topic={topic}
          activeSideTab={activeSideTab}
          handleSideTab={handleSideTab}
        />
      );
    }

    // For other visualizations, use the existing rendering logic
    const VisualizationComponent = VISUALIZATIONS[topic];
    if (!VisualizationComponent) {
      return <div>Visualization type not supported</div>;
    }

    return (
      <div className="visualization-container">
        <VisualizationComponent
          ref={visualizationRef}
          data={{
            nodes: data.nodes,
            edges: data.edges,
          }}
          activeHighlights={activeHighlights}
          onNodeClick={handleNodeClick}
        />
      </div>
    );
  };

  return <div className="app-container h-full">{renderVisualization()}</div>;
}
