'use client'
import { MdClose, MdMicNone, MdPause, MdUploadFile, MdPlayArrow, MdSend } from 'react-icons/md'
import { useEffect } from 'react'

interface ControlBarProps {
  isVideoPlaying: boolean;
  isRecording: boolean;
  transcript: string;
  handleVideoToggle: () => void;
  toggleRecording: () => void;
  setTranscript: (value: string) => void;
  setIsFileModalOpen: (value: boolean) => void;
  setShowErrorModal: (value: boolean) => void;
}

const ControlBar = ({
  isVideoPlaying,
  isRecording,
  transcript,
  handleVideoToggle,
  toggleRecording,
  setTranscript,
  setIsFileModalOpen,
  setShowErrorModal
}: ControlBarProps) => {
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

  const handleSend = () => {
    // Add your send logic here
    console.log('Sending message:', transcript);
    setTranscript('');
  };

  return (
    <div className='flex *:rounded *:border-gray-800 *:border flex-[3] items-end'>
      <div className='flex p-2 mx-2 gap-5 flex-1 items-end relative'>
        <MdUploadFile
          size="1.5em"
          className="cursor-pointer hover:text-gray-600"
          onClick={() => setIsFileModalOpen(true)}
        />
        <textarea
          placeholder="Ask me anything!"
          value={transcript}
          className="bg-transparent flex-1 border-none outline-none resize-none overflow-y-auto
                    [&::-webkit-scrollbar]:w-[4px]
                    [&::-webkit-scrollbar-thumb]:bg-gray-400
                    [&::-webkit-scrollbar-track]:bg-gray-800"
          onInput={handleInput}
          onChange={(e) => setTranscript(e.target.value)}
          style={{
            height: '24px',
            lineHeight: '24px',
            maxHeight: '70px'
          }}
        />
        {transcript && (
          <button
            onClick={handleSend}
            className=" "
          >
            <MdSend size="1.5em" />
          </button>
        )}
      </div>
      <div className="relative overflow-hidden">
        <button
          className={`py-2 mx-2 ${isRecording ? 'text-red-500' : ''} transition-colors relative`}
          onClick={toggleRecording}
        >
          <div className="relative">
            <MdMicNone
              size="1.5em"
              className={isRecording ? 'relative z-10' : ''}
            />
            {isRecording && (
              <div
                className="absolute inset-0 -m-2 z-0 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-red-500/75"
              />
            )}
          </div>
        </button>
      </div>
      <button 
        className={`${isVideoPlaying ? '' : 'bg-blue-500'} p-2 mx-2`}
        onClick={handleVideoToggle}
      >
        {isVideoPlaying ? <MdPause size="1.5em" /> : <MdPlayArrow size="1.5em" />}
      </button>
      <button 
        className='p-2 mx-2'
        onClick={() => setShowErrorModal(true)}
      >
        <MdClose size="1.5em" />
      </button>
    </div>
  )
}

export default ControlBar
