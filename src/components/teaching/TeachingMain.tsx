"use client";
import React, { useState, Suspense } from "react";
import KnowledgeGraphMain from "./KnowledgeGraph/KnowledgeGraphMain";
import NotesOverlay from "./Overlay/NotesOverlay";
import { Message } from "@/src/models/DoubtModel";
import RenderComponent from "./RenderComp";

export default function TeachingMain() {
  const [activeSideTab, setActiveSideTab] = useState<number>(0);

  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const[currentTopic, setCurrentTopic] = useState<number>(23);
  const [mainConversationHistory, setMainConversationHistory] = useState<
    Message[]
  >([]);
  const handleSideTab = (index: number) => {
    if (index === 0) {
      setActiveSideTab(index);
    } else {
      setActiveSideTab(index);
    }
  };

  return (
    <div className="p-5 flex gap-3">
      {activeSideTab != -1 && (
        <div
          className={
            "side_scroll border flex flex-col relative h-full min-h-[620px] overflow-y-auto  gap-3 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white w-full max-w-[300px]"
          }
        >
          {activeSideTab === 0 ? (
            <KnowledgeGraphMain  setCurrentTopic={setCurrentTopic} setActiveSideTab={setActiveSideTab} />
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

      <div className="border border-[var(--Border-Secondary)] h-full min-h-[620px] relative flex flex-col p-3  w-full rounded-xl bg-black">

        {/* <div style={{ height: "100%", width: "100%" }}>
          {TeachingVisualData && (
            <Suspense
              fallback={
                <p style={{ color: "white", textAlign: "center" }}>
                  ⏳ Loading...
                </p>
              }
            >
              <DynamicRenderer data={TeachingVisualData} />
            </Suspense>
          )}
        </div>
 */}
        <RenderComponent currentTopic={currentTopic} handleSideTab={handleSideTab} activeSideTab={activeSideTab}/>

      </div>
    </div>
  );
}