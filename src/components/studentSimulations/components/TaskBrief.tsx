import React from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
export default function TaskBrief() {
  const { TaskDiscussionDetails } = useSimulationModel();
  const {SimulationStartData} = useAppSelector((state: RootState)=>state.studentSimulation);
  
  return (
    <div className="flex flex-col gap-4 side_scroll w-full max-h-[550px] h-full  overflow-y-auto">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xl font-semibold">Task Brief</div>
        <div className="text-sm text-[var(--Content-Primary-static)]">
          Week {SimulationStartData && SimulationStartData?.state?.current_week}
        </div>
      </div>

      { SimulationStartData && TaskDiscussionDetails.map((task, index) => (
        <div className="flex flex-col gap-3 w-full " key={index}>
          <div className="text-base font-bold">{SimulationStartData.challenge.department}</div>
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
    </div>
  );
}
