import Image from "next/image";
import React from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import { Teamchat } from "../../studentAssessments/components/chat";

type Props = {
  handlesChatDiscuss: () => void;
};
export default function TeamChat({ handlesChatDiscuss }: Props) {
  const { TemMembersDetails, SimulationCompButtons } = useSimulationModel();
  return (
    <div className="flex flex-col justify-between  gap-3 side_scroll w-full max-h-[500px] h-full  overflow-y-auto">
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
            src={TemMembersDetails[0].icon}
            alt="image"
            height={36}
            width={36}
          />

          <div className="text-sm font-semibold">
            {TemMembersDetails[0].name}
          </div>
        </div>
      </div>

      {Teamchat.map((text, index) => (
        <div key={index} className="mb-5 flex flex-col">
          {text.req && (
            <div className="w-fit max-w-[80%] self-start   text-sm  px-4 py-1 mb-2 shadow-md">
              {text.req}
            </div>
          )}
          {text.showCompletion === true && (
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
          {text.res && (
            <div className="w-fit max-w-[80%] self-end bg-barBgColor  text-sm rounded-lg px-4 py-1 shadow-md">
              {text.res}
            </div>
          )}
        </div>
      ))}


    </div>
  );
}
