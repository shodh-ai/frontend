import React, { useEffect, useState, Suspense, useRef } from "react";
import * as d3 from "d3";
import { HierarchicalData } from "@/src/models/studentTeachingModel/TeachingVisualizationData";

interface DynamicRendererProps {
  data: HierarchicalData;
}

const useAudioNarration = (narration: string, isVideoPlaying: boolean) => {
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!narration) return;

    // Create speech instance if it doesn't exist
    if (!speechRef.current) {
      const speech = new SpeechSynthesisUtterance(narration);
      speech.rate = 1;
      speech.pitch = 1;

      speech.onboundary = (event) => {
        const text = narration.slice(event.charIndex, event.charIndex + event.charLength);
        setCurrentSubtitle(text);
      };

      speech.onend = () => {
        setCurrentSubtitle("");
        speechRef.current = null;
      };

      speechRef.current = speech;
    }

    // Control narration based on isVideoPlaying
    if (isVideoPlaying) {
      window.speechSynthesis.speak(speechRef.current);
    } else {
      window.speechSynthesis.cancel();
      setCurrentSubtitle("");
    }

    return () => {
      window.speechSynthesis.cancel();
      speechRef.current = null;
    };
  }, [narration, isVideoPlaying]);

  return { currentSubtitle };
};

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ data , isVideoPlaying }) => {
  const [Component, setComponent] = useState<React.FC<{ data: HierarchicalData }> | null>(null);

  useEffect(() => {
    if (!data || !data.jsx_code) {
      console.error("❌ No JSX code found in API response.");
      return;
    }

    async function loadComponent() {
      try {
        const cleanedJSX = data.jsx_code
          .replace(/\\\\/g, "\\")
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"');

        const sanitizedJSX = cleanedJSX
          .replace(/import\s+.*?from\s+["'].*?["'];?/g, "")
          .replace(/export\s+default\s+/g, "");

        const componentFunction = new Function(
          "React",
          "d3",
          `
          try {
            ${sanitizedJSX}
            if (typeof HierarchicalVisualization === "function") {
              return HierarchicalVisualization;
            } else {
              console.error("🚨 Invalid component.");
              return () => React.createElement("p", null, "⚠️ Error: Invalid Component");
            }
          } catch (err) {
            console.error("🚨 Error in JSX code:", err);
            return () => React.createElement("p", null, "⚠️ Rendering Error");
          }
          `
        );

        const DynamicComponent = componentFunction(React, d3);
        if (typeof DynamicComponent !== "function") {
          console.error("🚨 Component function invalid.");
          return;
        }
        setComponent(() => DynamicComponent);
      } catch (error) {
        console.error("🚨 JSX processing error:", error);
      }
    }

    loadComponent();
  }, [data]);

  const { currentSubtitle } = useAudioNarration(data.narration || "", isVideoPlaying);

  return (
    <Suspense fallback={<p style={{ color: "white", textAlign: "center" }}>⏳ Loading...</p>}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Dynamic Component */}
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {Component ? <Component data={data} /> : <p style={{ color: "white", textAlign: "center" }}>⚠️ Component Not Loaded</p>}
        </div>

        {/* Subtitle (below visualization) */}
        {currentSubtitle && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              width: "90%",
              maxWidth: "600px",
            }}
          >
            {currentSubtitle}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default DynamicRenderer;
