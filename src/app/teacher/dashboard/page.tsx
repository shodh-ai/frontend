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
  const [isTalkWithTitliVisible, setIsTalkWithTitliVisible] = useState(true);

  return (
    <div className="bg-black rounded-xl side_scroll max-h-[88vh] overflow-y-scroll text-white m-2 p-4 border border-zinc-700 ">
      {/* Main Content */}
      <h1 className="font-semibold mb-4">Class Performance</h1>
      <div className='flex h-full flex-row relative'>
      <div className={`${isTalkWithTitliVisible ? "mt-[40px] md:mt-0" : "mt-"} w-full`}>
          {/* Class Performance Header */}
          <div className="mb-8 w-full">
            <ClassFilters isTalkWithTitliVisible={isTalkWithTitliVisible} setIsTalkWithTitliVisible={setIsTalkWithTitliVisible}/>
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
        
        {isTalkWithTitliVisible && (
          <div className="xl:static absolute w-full md:w-auto z-30 top-[0px] md:top-[0px] right-0 lg:top-auto  md:px-0 xl:px-4">
            <TalkWithTitli
              isImageEnlarged={isImageEnlarged}
              setIsImageEnlarged={setIsImageEnlarged}
              onClose={() => setIsTalkWithTitliVisible(false)}
            />
          </div>
        )}
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