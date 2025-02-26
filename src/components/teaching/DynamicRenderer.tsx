import React, { useEffect, useState, Suspense } from "react";
import * as d3 from "d3"; 
import { HierarchicalData } from "./mockData";

interface DynamicRendererProps {
  data: HierarchicalData;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ data }) => {
  const [Component, setComponent] = useState<React.FC<{ data: HierarchicalData["data"] }> | null>(null);

  useEffect(() => {
    if (!data || !data.jsx_code) {
      console.error("❌ No JSX code found in API response.");
      return;
    }

    async function loadComponent() {
      try {
        console.log("📌 Received JSX Code:", data.jsx_code);

        const cleanedJSX = data.jsx_code.replace(/\\n/g, "")
        // **Step 1:** Remove `import` and `export` statements
        const sanitizedJSX = cleanedJSX
          .replace(/import\s+.*?from\s+["'].*?["'];?/g, "") // Remove import statements
          .replace(/export\s+default\s+/g, ""); // Remove export default

        // **Step 2:** Wrap JSX inside a function and pass `d3`
        const componentFunction = new Function(
          "React",
          "d3",
          "props",
          `
          const { data } = props;
          ${sanitizedJSX} // Inject sanitized JSX code
          return React.createElement(HierarchicalVisualization, props);
        `
        );

        // **Step 3:** Create a React component dynamically
        const DynamicComponent = (props: { data: HierarchicalData["data"] }) => componentFunction(React, d3, props);

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
          <p>✅ Component Loaded</p>
          <Component data={data.data} />
        </>
      ) : (
        <p>⚠️ Component Not Loaded</p>
      )}
    </Suspense>
  );
};

export default DynamicRenderer;