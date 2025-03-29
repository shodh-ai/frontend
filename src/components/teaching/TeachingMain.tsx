"use client";
import React, { useState, Suspense } from "react";
import KnowledgeGraphMain from "./KnowledgeGraph/KnowledgeGraphMain";
import NotesOverlay from "./Overlay/NotesOverlay";
import MainVisualization from "./MainVisualization";
import { Message } from "@/src/models/DoubtModel";
import PracticeQuestion from "./PracticeQuestion";

export default function TeachingMain() {
  const [activeSideTab, setActiveSideTab] = useState<number>(0);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("er"); // Use topic ID directly (e.g., "er")
  const [mainConversationHistory, setMainConversationHistory] = useState<
    Message[]
  >([]);

  const handleSideTab = (index: number) => {
    setActiveSideTab(index);
  };

  return (
    <div className="p-5 flex gap-3 h-full ">
      {activeSideTab !== -1 && (
        <div
          className={
            "side_scroll border flex flex-col h-full min-h-[620px] overflow-y-auto gap-3 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white min-w-[300px]"
          }
        >
          {activeSideTab === 0 ? (
            <KnowledgeGraphMain
              setActiveSideTab={setActiveSideTab}
              setCurrentTopic={setCurrentTopic}
              currentTopic={currentTopic}
            />
          ) : activeSideTab === 1 ? (
            <NotesOverlay
              mainConversationHistory={mainConversationHistory}
              conversationHistory={conversationHistory}
              setConversationHistory={setConversationHistory}
              setActiveSideTab={setActiveSideTab}
            />
          ) : null}
        </div>
      )}

      {currentTopic === "equation" ? (
        <PracticeQuestion
          handleSideTab={handleSideTab}
          activeSideTab={activeSideTab}
          currentTopic={currentTopic}
        />
      ) : (
        <div className="border border-[var(--Border-Secondary)] h-full min-h-[620px] relative flex flex-col p-3 w-full rounded-xl bg-black">
          <MainVisualization
            handleSideTab={handleSideTab}
            activeSideTab={activeSideTab}
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
          
          />
        </div>
      )}
    </div>
  );
}
