import React from "react";
import { useDashboardSemesterScore } from "../../models/DashBoardScore";

export default function LeaderShipScore() {
  const { LeaderShipTable } = useDashboardSemesterScore();
  return (
    <div className="w-1/2 border flex flex-col gap-3 border-[var(--Border-Secondary)] rounded-xl p-6 bg-black text-white max-lg:w-full ">
      <div className="text-base font-semibold">Leadership Score</div>
      
      <div
        className={`side_scroll flex flex-col lg:overflow-y-auto max-lg:overflow-auto max-h-[265px] `}
      >
        <div className="flex gap-2  text-xs text-[var(--Content-Primary-static)] pt-2">
        <div className="w-full min-w-[50px]">Rank</div>
        <div className="w-full min-w-[120px]">Name</div>
        <div className="w-full min-w-[80px]">Accuracy</div>
        <div className="w-full min-w-[80px]">Critical Thinking</div>
        <div className="w-full min-w-[80px]">Overall Score</div>
      </div>
        {LeaderShipTable.map((item, index) => (
          <div
            className="flex w-full items-center gap-2  text-xs py-3 border-b border-dashBoardBorderColor"
            key={index}
          >
            <div className="w-full min-w-[50px]">
              {index < 3 ? (
                <div className="max-w-[40px] w-full">
                  <button className="bg-dashBoardButtonBg rounded-3xl w-full text-[10px] py-[5px] px-[14px]">
                    {item.rank}
                  </button>
                </div>
              ) : (
                <div>#{item.rank}</div>
              )}
            </div>
            <div className="w-full min-w-[120px]">{item.name}</div>
            <div className="w-full min-w-[80px]">{item.accuracy}</div>
            <div className="w-full min-w-[80px]">{item.criticalthinking}</div>
            <div className="w-full min-w-[80px]">{item.overallScore}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
