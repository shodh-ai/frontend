import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ChatOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bottom-20 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center"
    >
      <div className=" w-full h-full  flex flex-col">
        <div className="flex flex-col mb-6 h-full">
          <Image src="/image.png" alt="close" width={5000} height={5000} className='w-full h-full' />
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Chat messages will be rendered here */}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatOverlay;