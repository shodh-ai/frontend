import Image from "next/image";
import React from "react";
import SimpleLineChart from "./ProgressGraph";

export default function DailyProgressTrack({
  improvement = "16% more score than last week",
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-base font-semibold">Daily Progress Tracker</div>
      <div className="flex gap-1 ">
        <Image
          src={"/dashboard/CircleArrowUp.svg"}
          alt="image"
          height={18}
          width={18}
        />
        <div className="text-xs">{improvement}</div>
      </div>

      <SimpleLineChart />
    </div>
  );
}
