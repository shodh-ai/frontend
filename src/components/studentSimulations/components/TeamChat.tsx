import Image from "next/image";
import React from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
type Props = {
  handlesChatDiscuss: () => void;
  value:string,
};
export default function TeamChat({ handlesChatDiscuss , value}: Props) {
  const { TemMembersDetails , SimulationCompButtons } = useSimulationModel();
  const { SimulationSubmitData } = useAppSelector(
      (state: RootState) => state.studentSimulation
    );
  
  
  return (
    <div className="flex flex-col   gap-3 side_scroll w-full max-h-[500px] h-full  overflow-y-auto">
      <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-3 gap-4 flex items-center justify-between rounded-md w-full">
        <Image
          src={"/LeftArrow.svg"}
          alt="image"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => handlesChatDiscuss()}
        />
        <div className="flex items-center gap-4 w-full cursor-pointer">
          <Image
            src={TemMembersDetails[3].icon}
            alt="image"
            height={36}
            width={36}
          />

          <div className="text-sm font-semibold">
            {TemMembersDetails[3].name}
          </div>
        </div>
      </div>

      {value  &&  <div className="w-fit max-w-[80%] self-end bg-barBgColor mr-2 text-sm rounded-lg px-4 py-2 shadow-md">
              {value}
            </div>}

      {SimulationSubmitData && SimulationSubmitData.discussion.map((member, index) => (
        <div
          key={index}
          className="mb-5 flex flex-col gap-2 w-full max-w-[90%] self-start   text-sm  px-4 py-1  shadow-md p-1 border border-dashBoardBorderColor"
        >
          <div className="text-sm font-semibold text-assessmentTextColor">
            {member.agent}
          </div>
          <div className="text-sm font-semibold">Revenue</div>
          <div className="flex w-full">
            <div className="max-w-[100px] text-sm  text-[var(--Content-Primary-static)]  w-full">
              Change:
            </div>
            <div className="text-sm">{member.metric_changes.revenue?.change}</div>
          </div>
          <div className="flex w-full">
            <div className="max-w-[100px] text-sm  text-[var(--Content-Primary-static)]  w-full">
              Reason:
            </div>
            <div className="text-sm">{member.metric_changes.revenue?.reason}</div>
          </div>
        </div>
      ))}

      {SimulationSubmitData && (
        <div className="w-full self-start border border-barBgColor flex flex-col gap-3  text-sm mt-3 px-4 py-2 mb-2 shadow-md">
        <div>
          Kindly inform me if the execution plan works for you or you
          would prefer any changes.
        </div>
        <div className="flex gap-2">
          {SimulationCompButtons.map((button, index) => (
            <button
              className="w-full border hover:bg-[#566FE9] rounded-md max-w-[140px] gap-2 p-3 flex items-center border-[var(--Border-Secondary)]"
              key={index}
            >
              <Image
                src={button.icon}
                alt="image"
                height={16}
                width={16}
              />
              <div className="text-xs">{button.label}</div>
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
