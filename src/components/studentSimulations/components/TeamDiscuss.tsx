import Image from "next/image";
import React, { useState } from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import TeamChat from "./TeamChat";

export default function TeamDiscuss() {
  const [showchat, setShowChat] = useState<boolean>(false);

  const handlesChatDiscuss = () => {
    setShowChat(!showchat);
  };

  const { TemMembersDetails } = useSimulationModel();
  return (
    <div className="flex flex-col h-full gap-4 ">
      <div className="text-xl font-bold">Team Discussion</div>

      {showchat ? (
        <div className="flex flex-col justify-between h-full">
          <TeamChat handlesChatDiscuss={handlesChatDiscuss} />
          <div className="w-full flex  text-xs">
            <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] border-r-0 p-3 max-sm:p-1 flex items-center justify-between rounded-tl-md rounded-bl-md w-full">
              <div className="flex gap-3 w-full">
                <Image
                  src={"/UploadFileIcon.svg"}
                  alt="image"
                  height={24}
                  width={24}
                />
                <input
                  placeholder="Ask me anything!"
                  className="border-none focus:outline-none   bg-transparent w-full text-nowrap"
                  type="text"
                />
              </div>
              <Image src={"/SendIcon.svg"} alt="image" height={32} width={32} />
            </div>
            <div className="flex justify-around items-center p-3 max-sm:p-1 b w-full max-w-[119px] max-sm:max-w-[40px] bg-barBgColor rounded-tr-md rounded-br-md">
              <Image src={"/TalkIcon.svg"} alt="image" height={32} width={32} />
              <div className="max-sm:hidden">Talk to me</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-3 gap-3 flex items-center justify-between rounded-md w-full">
            <Image src={"/SearchIcon.svg"} alt="image" width={24} height={24} />
            <input
              placeholder="Search"
              className="border-none focus:outline-none   bg-transparent w-full text-sm"
              type="text"
            />
          </div>

          {TemMembersDetails.map((member, index) => (
            <div
              className="flex gap-2 w-full cursor-pointer"
              onClick={handlesChatDiscuss}
              key={index}
            >
              <Image src={member.icon} alt="image" height={36} width={36} />
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <div className="text-sm font-semibold">{member.name}</div>
                  <div className="text-sm text-[var(--Content-Primary-static)]">
                    ({member.occupation})
                  </div>
                </div>
                <div className="text-xs text-[var(--Content-Primary-static)]">
                  {member.desc}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
