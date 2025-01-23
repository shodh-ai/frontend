import React from "react";
import { useAssignmentScorePageModel } from "../../models/AssignmentScore";

export default function UpcomingAssignments() {
  const { UpcomingAssignmentTable } = useAssignmentScorePageModel();
  return (
    <div className="flex flex-col gap-3">
      <div className="text-base font-semibold">Upcoming Assignments</div>

      <div className={" side_scroll flex flex-col gap-4 max-lg:overflow-x-auto"}>
        <div className="flex gap-2 text-xs text-[var(--Content-Primary-static)] w-full">
          <div className="w-full min-w-[150px]">Name</div>
          <div className="w-full min-w-[280px]">Description</div>
          <div className="w-full min-w-[70px]">Due Date</div>
          <div className="w-full min-w-[55px]">Status</div>
          <div className="w-full min-w-[90px]">Progress Bar</div>
          <div className="w-full min-w-[230px]"></div>
        </div>

        {UpcomingAssignmentTable.map((item, index) => (
          <div className="gap-2 flex text-xs" key={index}>
            <div className="w-full min-w-[150px]">{item.name}</div>
            <div className="w-full min-w-[280px]">{item.description}</div>
            <div className="w-full min-w-[70px]">{item.dueDate}</div>
            <div className="w-full min-w-[55px]">{item.status}</div>
            <div className="w-full min-w-[90px]">{item.progressBar}% Complete</div>
            <button className="w-full min-w-[230px] flex justify-center items-center rounded-md  bg-mainBackcolor ">Start Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
