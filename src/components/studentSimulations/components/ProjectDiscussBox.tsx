"use client";
import React, { useEffect, useState } from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import TaskBrief from "./TaskBrief";
import TeamDiscuss from "./TeamDiscuss";
import HistoryTab from "./HistoryTab";

import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { startSimulationStudent } from "@/src/features/studentSimulation/studentSimulationThunks";

export default function ProjectDiscussBox() {
  const {
    SinulationProjectTabs,
    // activeTab,
    // handleSelectTab,
  } = useSimulationModel();

  const dispatch = useAppDispatch();
  
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleSelectTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const [showchat, setShowChat] = useState<boolean>(true);
  
    const handlesChatDiscuss = (value: boolean) => {
      setShowChat(value);
    };  

  useEffect(() => {
    dispatch(startSimulationStudent()).then().catch((err) => console.error("Error while fetching", err));
  }, [dispatch]);

  
  return (
    <div className="border flex flex-col min-h-[664px] w-1/2 max-lg:w-full gap-4 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white">
      <div className="text-xs font-bold tracking-widest text-assessmentTextColor ">
        PROJECT MANAGEMENT
      </div>

      <div className="flex w-full py-2 gap-2 flex-wrap">
        {SinulationProjectTabs.map((item, index) => (
          <div
            className={`flex w-full max-w-[120px] text-xs items-center  p-3 rounded-md cursor-pointer ${
              activeTab === index
                ? "bg-barBgColor text-assessmentTextColor"
                : "bg-black text-[var(--Content-Primary-static)]"
            }
                 border border-dashBoardBorderColor`}
            onClick={() => handleSelectTab(index)}
            key={index}
          >
            {item.label}
          </div>
        ))}
      </div>
     {activeTab === 0 ? <TaskBrief  handlesChatDiscuss={handlesChatDiscuss} handleSelectTab={handleSelectTab} /> :  activeTab === 1 ? <TeamDiscuss showchat={showchat}  handlesChatDiscuss={handlesChatDiscuss}  handleSelectTab={handleSelectTab}/> : <HistoryTab/>}
    </div>
  );
}
