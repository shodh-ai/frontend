import React from 'react';
import { motion } from 'framer-motion';
import data from '@/src/components/teaching/data.json';
import { MdClose } from 'react-icons/md';

interface NotesOverlayProps {
  isVisible: boolean;
  setIsNotesEnabled: (value: boolean) => void;
}

const NotesOverlay: React.FC<NotesOverlayProps> = ({ isVisible,setIsNotesEnabled }) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute top-0 bottom-20 right-0 w-[50%]  bg-black backdrop-blur-sm z-20 flex items-center justify-center ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="w-full h-full mx-auto shadow-lg flex flex-col">
        <div className='px-6 py-3 flex justify-between'>
          <p>Doubts</p><MdClose size="1.5em" onClick={() => setIsNotesEnabled(!isVisible)} className='cursor-pointer'/>
          
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {data.chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-1 ${message.sender === 'student'
                    ? 'bg-zinc-800 text-white'
                    : 'text-white'
                    }`}
                >
                  
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

export default NotesOverlay;