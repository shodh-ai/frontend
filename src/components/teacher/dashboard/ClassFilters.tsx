import React from 'react';

const ClassFilters = () => {
  return (
    <div className="flex w-full">
      <div className='flex gap-4 mb-6 w-full'>
        <div className="w-1/3 bg-zinc-950 border border-zinc-700 h-max p-2 rounded">
          <select className="w-full bg-zinc-950 rounded-lg focus:outline-none">
            <option>Tech Business Models</option>
            <option>Tech Business Models</option>
            <option>Tech Business Models</option>
            <option>Tech Business Models</option>
          </select>
        </div>
        <div className="w-1/3 bg-zinc-950 border border-zinc-700 h-max p-2 rounded">
          <select className="w-full bg-zinc-950 rounded-lg focus:outline-none">
            <option>First Year - Batch C</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ClassFilters;