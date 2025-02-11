import React from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  handleSelectTab: (tabIndex: number) => void;
  handlesChatDiscuss: (value: boolean) => void;
};
export default function TaskBrief({
  handlesChatDiscuss,
  handleSelectTab,
}: Props) {
  const router = useRouter();
  const { TaskDiscussionDetails, TaskBrifButtons } = useSimulationModel();
  const { SimulationStartData } = useAppSelector(
    (state: RootState) => state.studentSimulation
  );

  const handleSinulationAction = (index: number) => {
    if (index === 0) {
      handlesChatDiscuss(true);
      handleSelectTab(1);
    } else if (index === 2) {
      router.push("/student/dashboard/1");
    }
  };

  return (
    <div className="flex flex-col gap-4 side_scroll w-full max-h-[550px] h-full  overflow-y-auto">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xl font-semibold">Task Brief</div>
        <div className="text-sm text-[var(--Content-Primary-static)]">
          Week {SimulationStartData && SimulationStartData?.state?.current_week}
        </div>
      </div>

      {SimulationStartData &&
        TaskDiscussionDetails.map((task, index) => (
          <div className="flex flex-col gap-3 w-full " key={index}>
            <div className="text-base font-bold">
              {SimulationStartData.challenge.department}
            </div>
            <div className="text-sm font-semibold">Company Details:</div>
            <div className="text-sm text-[var(--Content-Primary-static)]">
              {/* {task.task_details} */}
              {SimulationStartData.challenge.situation}
            </div>

            <div className="pt-2 text-sm font-semibold">Objectives:</div>
            <div className="flex flex-col gap-2 text-sm text-[var(--Content-Primary-static)]">
              <div>{task.task_objective.obj_text}</div>

              {task.task_objective.objective_details.map((item) => (
                <div className="flex gap-2" key={item.object_id}>
                  <div>{item.object_id}.</div>
                  <div>{item.object_text}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

      <div className="w-full self-start border border-barBgColor flex flex-col gap-3  text-sm mt-3 px-4 py-2 mb-2 shadow-md">
        <div>
        Talk to the CEO and work together to develop a comprehensive plan for execution.
        </div>
        <div className="flex gap-2 max-sm:flex-wrap">
          {TaskBrifButtons.map((button, index) => (
            <button
              className="w-full border hover:bg-[#566FE9] rounded-md max-w-[160px] gap-2 p-3 flex items-center border-[var(--Border-Secondary)]"
              key={index}
              onClick={() => handleSinulationAction(index)}
            >
              <Image src={button.icon} alt="image" height={16} width={16} />
              <div className="text-xs">{button.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
