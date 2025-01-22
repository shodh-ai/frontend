import Image from "next/image";
import React from "react";
import { useDashboardSemesterScore } from "../../models/DashBoardScore";
export default function SemesterScore({ title = "Semester Score" }) {
  const { ScoreTerms } = useDashboardSemesterScore();
  return (
    <div className="border flex flex-col gap-2 border-[var(--Border-Secondary)] rounded-xl p-6 bg-black text-white">
      <div className="text-base font-semibold">{title}</div>
    <div className="flex max-[600px]:flex-col max-[600px]:gap-4">
      {ScoreTerms.map((item, index) => (
        <div className={`flex w-1/4 max-[600px]:w-full max-[600px]:justify-center  max-[600px]:border-none ${index > 0 ? "border-l" : ""} ${index > 0 ? "px-2" : "pr-2"}  ${index > 0 ? "border-[var(--Border-Secondary)]" : ""} ${index > 0 ? "justify-center" : "justify-start"}`} key={index}>
        <div
          className={`flex flex-col gap-2`}
        >
          <div className="text-[var(--Content-Primary-static)] text-sm ">
            {item.label}
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-2xl max-md:text-base">{item.value}{index === ScoreTerms.length -1 ? "Hrs" : "%"}</div>
            <Image
              src={`${
                item.improvFlag
                  ? "/dashboard/CircleArrowUp.svg"
                  : "/dashboard/CircleDownArrow.svg"
              }`}
              alt="image"
              width={24}
              height={24}
            />
          </div>
          <div className="text-xs">
            {item.improvement} compared to last week
          </div>
        </div>
        </div>
      ))}
      </div>
    </div>
  );
}
