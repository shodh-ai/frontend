"use client";
import React, { useEffect, useState, Suspense } from "react";
import KnowledgeGraphMain from "./KnowledgeGraph/KnowledgeGraphMain";
import NotesOverlay from "./Overlay/NotesOverlay";
import DynamicRenderer from "./DynamicRenderer";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { getTeachingVisualization } from "@/src/features/studentTeaching/studentTeachingThunks";
import { RootState } from "@/src/store";
import { Message } from "@/src/models/DoubtModel";
import Image from "next/image";
import { MdClose, MdMicNone, MdPause, MdPlayArrow } from "react-icons/md";
import RenderComponent from "./RenderComp";

export default function TeachingMain() {
  const speechText =
    "Let's explore the shared memory architecture, where multiple processors effThe system consists of multiple CPUs The system consists of multiple CPUs  regfsdsf iciently access a common memory space.\n\n 1. The system consists of multiple CPUs The system consists of multiple CPUsfgsgsrgsfdg df gsdh sdf hh sdfh sthdb esdhfb   sdflsjfdjsfdlkj lkjlsfjk ff";

  const [activeSideTab, setActiveSideTab] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [mainConversationHistory, setMainConversationHistory] = useState<
    Message[]
  >([]);
  const [text, setText] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [currentSubtitle, setCurrentSubtitle] = useState(speechText);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const handleSideTab = (index: number) => {
    if (index === 0) {
      setActiveSideTab(index);
    } else {
      setActiveSideTab(index);
    }
  };

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(getTeachingVisualization({ topicId: 5 }))
  //     .unwrap()
  //     .then()
  //     .catch((err) => console.error("Error while fetching", err));
  // }, [dispatch]);

  const { TeachingVisualData, status } = useAppSelector(
    (state: RootState) => state.studentTeaching
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // handleSubmit();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleVideoPausing = () => {
    setIsVideoPlaying(!isVideoPlaying);
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

      <div className="border border-[var(--Border-Secondary)] h-full min-h-[620px] relative flex flex-col p-3  w-full rounded-xl bg-black">
        {status === "loading" && (
          <div className="flex justify-center text-center">Loading...</div>
        )}

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
        <RenderComponent handleSideTab={handleSideTab} activeSideTab={activeSideTab}/>

        {currentSubtitle && (
            <div
              className={"side_scroll"}
              style={{
                position: "absolute",
                bottom: "80px", // Close to the bottom but not touching
                left: "50%",
                maxHeight:"80px",
                height:"100%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(32, 32, 32, 0.85)", // Dark gray with slight transparency
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "10px", // Matches the smooth UI feel
                textAlign: "left", // Align text left for a chat-like effect
                width: "90%",
                maxWidth: "1000px", // Matches the image's aspect ratio
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "1.4",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Light depth effect
                wordBreak: "break-word", // Prevents text from overflowing
                transition: "opacity 0.3s ease-in-out", // Smooth fade-in effect
                overflowY:"auto",
              }}
            >
              {currentSubtitle}
            </div>
          )}

        {/* <div className="absolute bottom-0 left-0 right-0 flex w-full p-2 items-center gap-2 my-2 z-30">
          <div className="flex gap-2">
            <button
              className={`border border-[var(--Border-Secondary)] rounded-lg p-2   ${
                activeSideTab === 0 ? "bg-barBgColor" : ""
              }`}
              onClick={() => handleSideTab(0)}
            >
              <Image
                src={"/knowledgeGraph.svg"}
                alt="image"
                height={40}
                width={40}
                className="min-w-[24px] min-h-[24px] w-full"
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
                height={40}
                width={40}
                className="min-w-[24px] min-h-[24px] w-full"
              />
            </button>
          </div>
          <div className="bg-[#0D0D0D]  border border-[var(--Border-Secondary)]  p-2 max-sm:p-1 flex items-center justify-between rounded-md w-full">
            <div className="flex gap-3 w-full">
              <Image
                src={"/UploadFileIcon.svg"}
                alt="image"
                height={24}
                width={24}
              />
              <input
                placeholder="Ask me anything!"
                className="border-none focus:outline-none   bg-transparent w-full text-nowrap"
                // onChange={(e) => handleChange(e.target.value)}
                type="text"
                // value={content}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Image
              src={"/SendIcon.svg"}
              className="cursor-pointer"
              alt="image"
              height={32}
              width={32}
              // onClick={handleSubmit}
            />
          </div>
          <div className="flex gap-2">
            <button
              className={`p-2  border border-[var(--Border-Secondary)] rounded-lg${
                isRecording ? "text-red-500" : ""
              } transition-colors relative`}
              onClick={toggleRecording}
            >
              <div className="relative ">
                <MdMicNone
                  size="1.5em"
                  className={isRecording ? "relative z-10" : ""}
                />
                {isRecording && (
                  <div className="absolute inset-0 -m-2 z-0 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-red-500/75" />
                )}
              </div>
            </button>
            <button
              className={`border border-[var(--Border-Secondary)] rounded-lg ${
                isVideoPlaying ? "" : "bg-blue-500"
              }  p-2 `}
              onClick={handleVideoPausing}
            >
              {isVideoPlaying ? (
                <MdPause size="1.3em" />
              ) : (
                <MdPlayArrow size="1.3em" />
              )}
            </button>
            <button
              className={`border border-[var(--Border-Secondary)] rounded-lg p-3 }`}
            >
              <MdClose size="1.2em" />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
