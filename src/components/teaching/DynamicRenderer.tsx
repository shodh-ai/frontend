import React, { useEffect, useState, Suspense } from "react";
import * as d3 from "d3";
import { HierarchicalData } from "@/src/models/studentTeachingModel/TeachingVisualizationData";

interface DynamicRendererProps {
  data: HierarchicalData;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ data }) => {
  const [Component, setComponent] = useState<React.FC<{
    data: HierarchicalData;
  }> | null>(null);

  useEffect(() => {
    if (!data || !data.jsx_code) {
      console.error("❌ No JSX code found in API response.");
      return;
    }

    if (
      !data ||
      !Array.isArray(data?.nodes) ||
      !data.nodes?.length ||
      !Array.isArray(data?.edges)
    ) {
      console.error(
        "🚨 Invalid data format for hierarchical visualization:",
        data
      );
      return;
    }

    async function loadComponent() {
      try {
        // Ensure sanitized JSX is properly formatted
        console.log("recievedjsx_code", data.jsx_code);

        const cleanedJSX = data.jsx_code
          .replace(/\\\\/g, "\\") // Remove extra backslashes
          .replace(/\\n/g, "\n") // Convert escaped newlines
          .replace(/\\"/g, '"'); // Convert escaped quotes

        const sanitizedJSX = cleanedJSX
          .replace(/import\s+.*?from\s+["'].*?["'];?/g, "") // Remove imports
          .replace(/export\s+default\s+/g, ""); // Remove `export default`

          console.log("Sanitized code: ", sanitizedJSX);
        const componentFunction = new Function(
          "React",
          "d3",
          `
      try {
        ${sanitizedJSX} 

        if (typeof HierarchicalVisualization === "function") {
          return HierarchicalVisualization;
        } else {
          console.error("🚨 Evaluated JSX did not return a valid component.");
          return () => React.createElement("p", null, "⚠️ Error: Invalid Component");
        }
      } catch (err) {
        console.error("🚨 Error evaluating JSX code:", err);
        return () => React.createElement('p', null, '⚠️ Error rendering component');
      }
      `
        );

        // Execute function
        const DynamicComponent = componentFunction(React, d3);

        if (typeof DynamicComponent !== "function") {
          console.error(
            "🚨 Error: Component function did not return a valid React component."
          );
          return;
        }

  
        setComponent(() => DynamicComponent);
      } catch (error) {
        console.error("🚨 Error processing dynamic JSX code:", error);
      }
    }

    loadComponent();
  }, [data]);

  return (
    <Suspense fallback={<p>⏳ Loading component...</p>}>
      {Component ? (
        <>
          <Component data={data} />
        </>
      ) : (
        <p>⚠️ Component Not Loaded</p>
      )}
    </Suspense>
  );
};

export default DynamicRenderer;