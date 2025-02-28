import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Message } from "@/src/models/DoubtModel";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import Skeleton from "@mui/material/Skeleton";

interface ChatOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  conversationHistory: Message[];
  mainConversationHistory: Message[];
  setMainConversationHistory: (history: Message[]) => void;
  onSendMessage: (message: string) => Promise<void>;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  isVisible,
  conversationHistory,
  mainConversationHistory,
  onSendMessage
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const conversationContainerRef = useRef<HTMLDivElement | null>(null);
  const submitDoubtLoading = useAppSelector(
    (state) => state.StudentDoubt.submitDoubt.loading
  );

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 bottom-24 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center
         ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <div className="w-full h-full mx-auto shadow-lg flex flex-col [&::-webkit-scrollbar]:w-[4px]
                    [&::-webkit-scrollbar-thumb]:bg-gray-400
                    [&::-webkit-scrollbar-track]:bg-gray-800">
        <div className="px-6 py-3">Chat</div>
        <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-gray-800">
          <div className="space-y-4">
            <>
              {mainConversationHistory.map((message, index) => (
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
                        : "bg-white text-black"
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
      </div>
    </motion.div>
  );
};

export default ChatOverlay;
