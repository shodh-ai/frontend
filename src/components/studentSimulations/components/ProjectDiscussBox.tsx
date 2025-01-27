"use client";
import React from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import TaskBrief from "./TaskBrief";
import TeamDiscuss from "./TeamDiscuss";
import HistoryTab from "./HistoryTab";

export default function ProjectDiscussBox() {
  const {
    SinulationProjectTabs,
    activeTab,
    handleSelectTab,
  } = useSimulationModel();
  return (
    <div className="border flex flex-col min-h-[664px] max-lg:max-w-full gap-4 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white">
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
     {activeTab === 0 ? <TaskBrief/> :  activeTab === 1 ? <TeamDiscuss/> : <HistoryTab/>}
    </div>
  );
}
