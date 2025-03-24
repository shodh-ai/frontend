import React from 'react';
import Image from 'next/image';
import { SparklesIcon, XIcon } from 'lucide-react';

interface TalkWithTitliProps {
  isImageEnlarged: boolean;
  setIsImageEnlarged: (value: boolean) => void;
}

const TalkWithTitli: React.FC<TalkWithTitliProps> = ({
  isImageEnlarged,
  setIsImageEnlarged
}) => {
  return (
    <div className='w-4/12 flex flex-col items-end gap-4 ml-8'>
      <button className='flex p-2 justify-center bg-zinc-950 w-2/5 rounded border border-zinc-700 gap-2'>
        <SparklesIcon />Talk with Titli
      </button>
      <div className="">
        <div className="bg-zinc-950 border border-zinc-700 rounded-lg shadow-xl w-full h-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800">
            <h3 className="font-semibold text-sm">TALK WITH TITLY</h3>
            <div className="text-zinc-400">
              <XIcon size={18} />
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto h-full">
            <div className="bg-zinc-950 rounded-lg p-3 mb-6">
              <div className="h-40 w-full relative">
                <Image src="/dashboard/graph.png" alt="img" height={5000} width={5000} className='w-full h-full'/>
                <button
                  className="absolute bottom-0 right-0 bg-black/10 p-2 rounded-lg"
                  onClick={() => setIsImageEnlarged(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-zinc-400 mb-3">Recommended Questions:</h4>
              <div className="space-y-2 text-xs">
                <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-2 rounded-lg cursor-pointer">
                  Show students who always submit late.
                </div>
                <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-2 rounded-lg cursor-pointer">
                  How many students completed [Assignment Name]?
                </div>
                <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-2 rounded-lg cursor-pointer">
                  Which students frequently use the Talk with AI feature?
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-zinc-800">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Ask me anything!"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 focus:outline-none"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors p-2 rounded-lg ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalkWithTitli;