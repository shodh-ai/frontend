import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MdClose, MdSend, MdUploadFile } from "react-icons/md";
import { submitDoubt } from "@/src/features/StudentDoubts/DoubtThunk";
import { DoubtRequest, Message } from "@/src/models/DoubtModel";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import Skeleton from "@mui/material/Skeleton";

import Box from "@mui/material/Box";
import Image from "next/image";
interface NotesOverlayProps {
  
  setActiveSideTab: (index: number) => void;
  // setIsFileModalOpen: (value: boolean) => void;
  mainConversationHistory: Message[];
  conversationHistory: Message[];
  setConversationHistory: React.Dispatch<React.SetStateAction<Message[]>>;
}

const NotesOverlay: React.FC<NotesOverlayProps> = ({
  // isVisible,
  // setIsNotesEnabled,
  // setIsFileModalOpen,
  mainConversationHistory,
  conversationHistory,
  setConversationHistory,
  setActiveSideTab,
}) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const dispatch = useAppDispatch();

  const submitDoubtLoading = useAppSelector(
    (state) => state.StudentDoubt.submitDoubt.loading
  );

  // const setToggle = () => {
  //   // setIsNotesEnabled(!isVisible);
  //   setActiveSideTab(0);
  // };

  const conversationContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handleSend = async () => {
    if (currentMessage.trim() !== "") {
      const userMessage: Message = {
        role: "user",
        content: currentMessage,
      };

      const newConversationHistory = [...conversationHistory, userMessage];
      setConversationHistory(newConversationHistory);
      const requestData: DoubtRequest = {
        main_conversation_history: mainConversationHistory,
        conversation_history: newConversationHistory,
        current_message: currentMessage,
      };
      setCurrentMessage("");
      try {
        const result = await dispatch(submitDoubt(requestData)).unwrap();

        const assistantReply: Message = {
          role: "assistant",
          content: result.assistant_reply,
        };

        const updatedConversationHistory = [
          ...newConversationHistory,
          assistantReply,
        ];
        localStorage.setItem(
          "conversationHistory",
          JSON.stringify(updatedConversationHistory)
        );
        setConversationHistory(updatedConversationHistory);
      } catch (error) {
        console.error("Error dispatching submitDoubt:", error);
      }
    }
  };
  return (
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   exit={{ opacity: 0 }}
    //   className={`w-full absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm z-30 flex justify-end ${
    //     isVisible ? "visible" : "hidden"
    //   }`}
    // >
    // {/* <div className="w-[50%] border-2 border-zinc-600 h-full rounded-xl shadow-lg flex flex-col"> */}
    <div className="h-full flex flex-col ">
      <div className=" flex justify-between">
        <div className="text-xs font-bold text-assessmentTextColor tracking-widest">
          DOUBTS
        </div>
        <Image
          src={"/CrossIcon.svg"}
          alt="cross image"
          height={16}
          width={16}
          className="cursor-pointer"
          onClick={() => setActiveSideTab(-1)}
        />
      </div>
      <div ref={conversationContainerRef} className="h-full pt-3 overflow-y-auto ">
        <div className="space-y-4">
          <>
            {conversationHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-1 ${
                    message.role === "user"
                      ? "bg-zinc-800 text-white"
                      : "text-white"
                  }`}
                >
                  <div>{message.content}</div>
                </div>
              </div>
            ))}
            {submitDoubtLoading && (
              <div
                className={`flex
                 "justify-start"
                }`}
              >
                <Skeleton
                  variant="rectangular"
                  width={"50%"}
                  height={80}
                  style={{
                    background: "#e5e7eb3b",
                    borderRadius: "10px",
                  }}
                />
              </div>
            )}
          </>
        </div>
      </div>
      <div className="flex bg-zinc-900 rounded p-2  gap-5 flex-1 justify-center items-center  bottom-5 left-2 right-2">
        <MdUploadFile
          size="1.5em"
          className="cursor-pointer hover:text-gray-600"
          // onClick={() => setIsFileModalOpen(true)}
        />
        <textarea
          placeholder="Ask me anything!"
          value={currentMessage}
          className="bg-transparent flex-1 border-none outline-none resize-none overflow-y-auto
              [&::-webkit-scrollbar]:w-[4px]
              [&::-webkit-scrollbar-thumb]:bg-gray-400
              [&::-webkit-scrollbar-track]:bg-gray-800"
          onChange={(e) => setCurrentMessage(e.target.value)}
          style={{
            height: "20px",
            lineHeight: "20px",
            maxHeight: "70px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* <button onClick={handleSend}>
            <MdSend size="1.5em" />
          </button> */}
        <Image
          src={"/SendIcon.svg"}
          className="cursor-pointer"
          alt="image"
          height={32}
          width={32}
          onClick={handleSend}
        />
      </div>
    </div>
    // </motion.div>
  );
};

export default NotesOverlay;
