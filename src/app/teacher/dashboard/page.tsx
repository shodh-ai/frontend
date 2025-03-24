'use client';
import React, { useState } from 'react';
import {
  ClassFilters,
  PerformanceStats,
  StudentDetailsTable,
  ImageModal,
  TalkWithTitli
} from '../../../components/teacher';

const Dashboard = () => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-black rounded-xl max-h-[88vh] text-white m-2 p-4 border border-zinc-700">
      {/* Main Content */}
      <h1 className="font-semibold mb-4">Class Performance</h1>
      <div className='flex h-full'>
        <div className="w-8/12">
          {/* Class Performance Header */}
          <div className="mb-8 w-max">
            <ClassFilters />
            {/* Performance Stats */}
            <PerformanceStats />
          </div>

          <div className='w-full gap-3'>
            <StudentDetailsTable
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
        
        <TalkWithTitli
          isImageEnlarged={isImageEnlarged}
          setIsImageEnlarged={setIsImageEnlarged}
        />
      </div>

      <ImageModal
        isOpen={isImageEnlarged}
        onClose={() => setIsImageEnlarged(false)}
        imagePath="/dashboard/graph.png"
      />
    </div>
  );
};

export default Dashboard;