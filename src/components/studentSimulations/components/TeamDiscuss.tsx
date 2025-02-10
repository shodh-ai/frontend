import Image from "next/image";
import React, {  useState } from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import TeamChat from "./TeamChat";

type Props = {
  handleSelectTab : (tabIndex: number) =>void;
}

export default function TeamDiscuss({handleSelectTab}:Props) {
  const [showchat, setShowChat] = useState<boolean>(true);

  const handlesChatDiscuss = () => {
    setShowChat(!showchat);
  };  


  const { TemMembersDetails } = useSimulationModel();
  return (
    <div className="flex flex-col h-full gap-4 ">
      <div className="text-xl font-bold">Team Discussion</div>

      {showchat ? (
          <TeamChat handlesChatDiscuss={handlesChatDiscuss}  handleSelectTab={handleSelectTab}/>
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
