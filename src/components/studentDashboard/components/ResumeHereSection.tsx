import React from "react";
import { useDashboardSemesterScore } from "../../models/DashBoardScore";
import Image from "next/image";
export default function ResumeHereSection() {
  const { ResumeHere } = useDashboardSemesterScore();
  const firsIndex = ResumeHere.length / 2;

  return (
    <div className="border flex flex-col gap-3 border-[var(--Border-Secondary)] rounded-xl p-6 bg-black text-white">
      <div className="text-base font-semibold">Resume Here</div>

      <div className="w-full flex justify-between gap-4 max-sm:hidden">
        <div className="flex flex-col gap-2 text-xs w-full max-w-[50%] ">
          {ResumeHere.slice(0, firsIndex).map((item) => (
            <div className="w-full flex justify-between gap-3" key={item.title}>
              <div className="w-full max-w-[120px] font-semibold">
                {item.title}
              </div>
              <div className="w-full text-[var(--Content-Primary-static)]">
                {item.description}
              </div>
              <div className="w-full max-w-[40px]">
                <Image
                  src={"/dashboard/ResumeIcon.svg"}
                  alt="image"
                  height={32}
                  width={32}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 w-full max-w-[50%] ">
          {ResumeHere.slice(firsIndex, ResumeHere.length).map((item) => (
            <div
              className="w-full flex justify-between text-xs gap-3"
              key={item.title}
            >
              <div className="w-full max-w-[120px]">{item.title}</div>
              <div className="w-full text-[var(--Content-Primary-static)]">
                {item.description}
              </div>
              <div className="w-full max-w-[40px]">
                <Image
                  src={"/dashboard/ResumeIcon.svg"}
                  alt="image"
                  height={32}
                  width={32}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="min-[639px]:hidden flex flex-col gap-2 w-full">
        {ResumeHere.map((item) => (
          <div
          className="w-full flex justify-between text-xs gap-3"
          key={item.title}
        >
          <div className="w-full max-w-[120px]">{item.title}</div>
          <div className="w-full text-[var(--Content-Primary-static)]">
            {item.description}
          </div>
          <div className="w-full max-w-[40px]">
            <Image
              src={"/dashboard/ResumeIcon.svg"}
              alt="image"
              height={32}
              width={32}
            />
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
