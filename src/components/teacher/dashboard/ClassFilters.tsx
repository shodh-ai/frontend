import { SparklesIcon } from 'lucide-react';
import React from 'react';

interface ClassFiltersProps {
  isTalkWithTitliVisible: boolean;
  setIsTalkWithTitliVisible: (value: boolean) => void;
}

const ClassFilters = ({isTalkWithTitliVisible, setIsTalkWithTitliVisible}: ClassFiltersProps) => {
  return (
    <div className="flex w-full flex-col-reverse md:flex-row mb-6 md:mb-0">
      <div className='flex flex-col md:flex-row gap-4 mt-4 md:mb-6 md:mt-0 w-full'>
        <div className="w-full md:w-1/5 bg-zinc-950 border border-zinc-700 h-max p-2 rounded">
          <select className="w-full bg-zinc-950 rounded-lg focus:outline-none">
            <option>Tech Business Models</option>
            <option>Tech Business Models</option>
            <option>Tech Business Models</option>
            <option>Tech Business Models</option>
          </select>
        </div>
        <div className="w-full md:w-1/5 bg-zinc-950 border border-zinc-700 h-max p-2 rounded">
          <select className="w-full bg-zinc-950 rounded-lg focus:outline-none">
            <option>First Year - Batch C</option>
          </select>
        </div>
      </div>
          <button 
            onClick={() => setIsTalkWithTitliVisible(true)}
            className={`${isTalkWithTitliVisible ? "hidden":"visible"} w-full lg:w-1/5 flex h-max p-2 justify-center bg-zinc-950 rounded border border-zinc-700 gap-2 hover:bg-zinc-900 transition-colors`}
          >
          <SparklesIcon />Talk with Titli
        
          </button>
    </div>
  );
};

export default ClassFilters;