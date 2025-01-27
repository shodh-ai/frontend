import React from 'react';
import { motion } from 'framer-motion';
import data from '@/src/components/teaching/data.json';

interface ChatOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ isVisible }) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 h-full bottom-20 bg-black backdrop-blur-sm z-20 flex items-center justify-center ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="w-full h-full mx-auto shadow-lg flex flex-col">
        <div className='px-6 py-3'>
          Chat
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {data.chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'student'
                    ? 'bg-zinc-900 text-white'
                    : 'text-white'
                    }`}
                >
                  {/* <div className="font-semibold text-sm">{message.name}</div> */}
                  <div>{message.message}</div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatOverlay;