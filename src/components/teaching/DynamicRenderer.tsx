import React, { useEffect, useState, Suspense } from "react";
import * as d3 from "d3";

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

interface DynamicRendererProps {
  data: HierarchicalData;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ data }) => {
  const [Component, setComponent] = useState<React.FC<{ data: HierarchicalData["data"] }> | null>(null);

  useEffect(() => {
    if (!data || !data.jsx_code) {
      console.error("No JSX code found in API response.");
      return;
    }

    try {
      console.log("Received JSX Code:", data.jsx_code);

      // Function wrapper to avoid JSX syntax errors
      const cleanedJSX = data.jsx_code.replace(/\\n/g, "");
      const wrappedCode = `
        return function HierarchicalVisualizationComponent(props) {
          const { useEffect, useRef } = React;
          

          ${cleanedJSX}  // Ensure the JSX is correctly interpreted

          return React.createElement(HierarchicalVisualization, props);
        };
      `;

      // Create and execute function
      const componentFactory = new Function("React", "d3", wrappedCode);
      const GeneratedComponent = componentFactory(React, d3);

      if (typeof GeneratedComponent !== "function") {
        throw new Error("Generated component is not a valid React component.");
      }

      setComponent(() => GeneratedComponent);
    } catch (error) {
      console.error("Error processing dynamic JSX code:", error);
    }
  }, [data]);

  return (
    <Suspense fallback={<p>Loading component...</p>}>
      {Component ? <><p>✅ Component Loaded</p> <Component data={data.data} />  </>: <p>Component Not Loaded</p>}
    </Suspense>
  );
};

export default DynamicRenderer;
