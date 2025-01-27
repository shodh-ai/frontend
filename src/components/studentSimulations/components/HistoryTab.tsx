import Image from "next/image";
import React from "react";
import { useSimulationModel } from "../../models/SimulationPage";

export default function HistoryTab() {
  const { TemMembersDetails } = useSimulationModel();
  return (
    <div className="flex flex-col gap-4 side_scroll w-full max-h-[450px] h-full  overflow-y-auto">
      <div className="text-xl font-bold">History</div>
      <div className="text-base font-bold">Last Week</div>

      <div className="flex gap-2 w-full cursor-pointer">
        <Image
          src={TemMembersDetails[0].icon}
          alt="image"
          height={36}
          width={36}
        />
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <div className="text-sm font-semibold">{TemMembersDetails[0].name}</div>
            <div className="text-sm text-[var(--Content-Primary-static)]">
              ({TemMembersDetails[0].occupation})
            </div>
          </div>
          <div className="text-xs text-[var(--Content-Primary-static)]">
            {TemMembersDetails[0].desc}
          </div>
        </div>
      </div>
    </div>
  );
}
