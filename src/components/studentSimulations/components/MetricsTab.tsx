import React from "react";
import { metricesData } from "../../studentAssessments/components/chat";
import { useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";

const MetricsTab: React.FC = () => {
  
  const {SimulationStartData, status} = useAppSelector((state: RootState)=>state.studentSimulation);

  if(status === "loading"){
    return <div className="flex justify-center items-center">Loading....</div>
  }
  return (
    <div className="flex flex-col">
      <h3 className="text-xl mt-2 mb-6 font-bold">Metrics</h3>
      {SimulationStartData && Object.entries(SimulationStartData.metrics.core).map(([key, value], index) => (
        <div
          key={key}
          className={`w-full flex text-sm border  border-dashBoardButtonBg ${
            index === 0 ? "rounded-tl-md    rounded-tr-md" : ""
          } ${index === Object.entries(metricesData.core).length -1 ? " rounded-bl-md rounded-br-md" : ""}`}
        >
          <div className="w-full max-w-[250px] p-3 border-r border-dashBoardButtonBg capitalize">
            {key.replace(/_/g, " ")}
          </div>
          <div className="w-full p-3">{value}</div>
        </div>
      ))}


      <h3 className="text-xl font-bold mt-6 mb-6">Department</h3>
      { SimulationStartData && Object.entries(SimulationStartData.metrics.department).map(([key, value], index) => (
        <div
          key={key}
          className={`w-full flex border text-sm  border-dashBoardButtonBg ${
            index === 0 ? "rounded-tl-md    rounded-tr-md" : ""
          } ${index === Object.entries(metricesData.department).length -1 ? " rounded-bl-md rounded-br-md" : ""}`}
        >
          <div className="w-full max-w-[250px] p-3 border-r border-dashBoardButtonBg capitalize">
            {key.replace(/_/g, " ")}
          </div>
          <div className="w-full p-3">{value}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsTab;
