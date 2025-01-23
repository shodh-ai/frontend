import React from "react";
import { useDashboardSemesterScore } from "../../models/DashBoardScore";

export default function AssignmentAssigned() {
  const { AssignmentTable } = useDashboardSemesterScore();
  return (
    <>
      <div className="text-base font-semibold">Assignment Assigned</div>
      
      <div className={`side_scroll flex w-full flex-col max-h-[261px] max-sm:max-w-[560px] lg:overflow-y-auto max-lg:overflow-auto  `}>
      <div className="flex w-full gap-2 text-xs text-[var(--Content-Primary-static)] pt-2">
        <div className="w-full min-w-[210px]">Name</div>
        <div className="w-full min-w-[80px]">Task Status</div>
        <div className="w-full min-w-[80px]">Deadline</div>
        <div className="w-full min-w-[80px]">Priority Level</div>
      </div>
        {AssignmentTable.map((item, index) => (
          <div
            className="flex w-full gap-2 items-center text-xs py-2 border-b border-dashBoardBorderColor"
            key={index}
          >
            <div className="w-full min-w-[210px]">{item.name}</div>
            <div className="w-full min-w-[80px]">{item.taskStatus}</div>
            <div className="w-full min-w-[80px]">{item.deadline}</div>
            <div className="w-full min-w-[80px]">
              <div className="max-w-[75px] w-full">
                <button className="bg-dashBoardButtonBg rounded-3xl w-full text-[10px] py-[8px] px-[14px]">
                  {item.priorityLevel}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
