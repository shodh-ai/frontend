

"use client";

import React, { useState, useEffect } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import Visualiser from "./components/Visualiser"; 
import FloatingNav from "./components/FloatingNav";
import visualization from "./components/data/visualisation.json"; 
import { Visualisation } from "./components/Visualisation";

// Define TypeScript interfaces for your data
interface QuestionData {
  question: string;
  answer: string[];
  answer_template: string[];
}

const questionData: QuestionData = {
  question:
    "Solve the system of equations for \\( x \\) and \\( y \\): \n\n \\begin{equation} 2x + 3y = 12 \\end{equation} \n \\begin{equation} 4x - y = 5 \\end{equation}",
  answer: [
    "Multiply the second equation by 3 to align coefficients with the first equation: \\begin{equation} 12x - 3y = 15 \\end{equation}",
    "Add the two equations: \\begin{equation} 14x = 27 \\end{equation}",
    "Solve for \\( x \\): \\begin{equation} x = 1.92 \\end{equation}",
    "Substituting \\( x \\) in the first equation: \\begin{equation} 3.84 + 3y = 12 \\end{equation}",
    "Solving for \\( y \\): \\begin{equation} y = 2.72 \\end{equation}",
  ],
  answer_template: [
    "Multiply the second equation by --INSERT--: \\begin{equation} --INSERT-- \\end{equation}",
    "Add the two equations: \\begin{equation} --INSERT--x = 27 \\end{equation}",
    "Solve for \\( x \\): \\begin{equation} x = --INSERT-- \\end{equation}",
    "Substituting \\( x \\) in the first equation: \\begin{equation} --INSERT-- + --INSERT--y = 12 \\end{equation}",
    "Solving for \\( y \\): \\begin{equation} y = --INSERT-- \\end{equation}",
  ],
};

// Utility function to get the last start index from visualization
function getLastStartIndex(visualization: Visualisation): number {
  const startOrders = visualization.elements.flatMap((element) =>
    element.frames.map((frame) => frame.start_order)
  );
  return Math.max(...startOrders);
}

export default function PracticeQuestion() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  // Set the max step index from visualization data
  useEffect(() => {
    setStartIndex(getLastStartIndex(visualization as Visualisation));
  }, []);

  // Handle input changes for the answer template
  const handleInputChange = (index: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Extract values to pre-fill placeholders
  const extractInsertValues = (): string[] => {
    const values: string[] = [];
    questionData.answer.forEach((ans) => {
      const parts = ans.split(/\\begin{equation}|\\end{equation}/);
      parts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed && !trimmed.includes("\\") && !trimmed.includes("figure")) {
          values.push(trimmed);
        }
      });
    });
    return values;
  };

  // Render the answer template with inputs
  const renderAnswerTemplate = () => {
    const insertValues = extractInsertValues();
    let insertIndex = 0;

    return questionData.answer_template.map((step, index) => {
      if (!step) return null;

      const parts = step.split("--INSERT--");
      return (
        <div key={index} className="text-sm text-white">
          {parts.map((part, i) => {
            const latexContent = part
              .replace(/\\begin{equation}/g, "")
              .replace(/\\end{equation}/g, "");

            if (i < parts.length - 1) {
              const inputKey = `${index}-${i}`;
              const defaultValue = insertValues[insertIndex++] || "";
              return (
                <React.Fragment key={i}>
                  <Latex>{latexContent}</Latex>
                  <input
                    type="text"
                    value={inputs[inputKey] || ""}
                    onChange={(e) => handleInputChange(inputKey, e.target.value)}
                    placeholder={defaultValue}
                    className="inline-block w-24 mx-1 p-1 text-black rounded border border-gray-300"
                  />
                </React.Fragment>
              );
            }
            return <Latex key={i}>{latexContent}</Latex>;
          })}
        </div>
      );
    });
  };

  // Render the question with proper LaTeX formatting
  const renderedQuestion = (
    <Latex>
      {questionData.question
        .replace(/\\begin{equation}/g, "\\[")
        .replace(/\\end{equation}/g, "\\]")}
    </Latex>
  );

  // Navigation handlers
  const handleBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, startIndex));
  };

  return (
    <div className="flex flex-col w-full gap-2 relative overflow-hidden border border-dashBoardButtonBg rounded-xl bg-black">

        <Visualiser
          visualization={visualization as Visualisation}
          currIndex={currentIndex}
        />
        <FloatingNav
        onBack={handleBack}
        onForward={handleForward}
        onRefresh={() => window.location.reload()}
      />
      
    </div>
  );
}