"use client";
import React, { useEffect, useState } from "react";
import KnowledgeGraphMain from "./KnowledgeGraph/KnowledgeGraphMain";
import NotesOverlay from "./Overlay/NotesOverlay";
import DynamicRenderer from "./DynamicRenderer";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { getTeachingVisualization } from "@/src/features/studentTeaching/studentTeachingThunks";
import { RootState } from "@/src/store";
import { Message } from "@/src/models/DoubtModel";
import Image from "next/image";

export default function TeachingMain() {
  const [activeSideTab, setActiveSideTab] = useState<number>(0);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTeachingVisualization({ topicId: 5 }))
      .unwrap()
      .then()
      .catch((err) => console.error("Error while fetching", err));
  }, [dispatch]);

  const { TeachingVisualData, status } = useAppSelector(
    (state: RootState) => state.studentTeaching
  );
  return (
    <div className="p-5 flex gap-3">
      {activeSideTab != -1 && (
        <div className="border flex flex-col min-h-[640px]  gap-3 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white w-full max-w-[300px]">
          {activeSideTab === 0 ? (
            <KnowledgeGraphMain setActiveSideTab={setActiveSideTab} />
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

      <div className="border border-[var(--Border-Secondary)] relative flex flex-col p-3  w-full rounded-xl bg-black">
        {status === "loading" && (
          <div className="flex justify-center text-center">Loading...</div>
        )}

        {TeachingVisualData && <DynamicRenderer data={TeachingVisualData} />}

        <div className="flex absolute bottom-1">
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
        </div>
      </div>
    </div>
  );
}
