import React, { useState } from 'react';
import { motion } from 'framer-motion';
import data from '@/src/components/teaching/data.json';
import { MdClose, MdSend, MdUploadFile } from 'react-icons/md';

interface NotesOverlayProps {
  isVisible: boolean;
  setIsNotesEnabled: (value: boolean) => void;
  handleVideoToggle: () => void;
  setIsFileModalOpen: (value: boolean) => void;
}

const NotesOverlay: React.FC<NotesOverlayProps> = ({ isVisible, setIsNotesEnabled, setIsFileModalOpen }) => {
  const [value, setValue] = useState('')
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const textarea = e.target;
    const lineHeight = 24;
    const initialHeight = 24;
    const maxLines = 3;
    const maxHeight = initialHeight + (lineHeight * (maxLines - 1));

    textarea.style.height = initialHeight + 'px';
    
    if (textarea.scrollHeight > initialHeight) {
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };
  const setToggle = () => {
    setIsNotesEnabled(!isVisible)
    // handleVideoToggle()
  }
  const handleSend = () => {
    setValue('');
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full absolute inset-0 rounded-xl bg-black/80 backdrop-blur-sm z-30 flex justify-end ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="w-[50%] border-2 border-zinc-600 h-full rounded-xl shadow-lg flex flex-col">
        <div className='px-6 py-3 flex justify-between'>
          <p>Doubts</p><MdClose size="1.5em" onClick={setToggle} className='cursor-pointer' />

        </div>
        <div className="h-full overflow-y-auto p-4">
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
        <div className='flex bg-zinc-900 rounded p-2 m-2 gap-5 flex-1 items-end relative'>
          <MdUploadFile
            size="1.5em"
            className="cursor-pointer hover:text-gray-600"
            onClick={() => setIsFileModalOpen(true)}
          />
          <textarea
            placeholder="Ask me anything!"
            value={value}
            className="bg-transparent flex-1 border-none outline-none resize-none overflow-y-auto
                            [&::-webkit-scrollbar]:w-[4px]
                            [&::-webkit-scrollbar-thumb]:bg-gray-400
                            [&::-webkit-scrollbar-track]:bg-gray-800"
                            onInput={handleInput}
            onChange={(e) => setValue(e.target.value)}
            style={{
              height: '24px',
              lineHeight: '24px',
              maxHeight: '70px'
            }}
          />

          <button
            onClick={handleSend}
            className=" "
          >
            <MdSend size="1.5em" />
          </button>

        </div>
      </div>
    </motion.div>
  );
};

export default NotesOverlay;