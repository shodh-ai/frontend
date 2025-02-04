// import { Card, CardContent } from '@mui/material'
import React from "react";
import { metricesData } from "../../studentAssessments/components/chat";

// interface MetricRow {
//   metric: string
//   value1: number
//   value2: number
// }

// interface MetricsTabProps {
//   metricsData: MetricRow[]
// }

const MetricsTab: React.FC = () => {
  return (
    // <div className="overflow-x-auto">
    //   <Card sx={{ bgcolor: "black", color: "white" }}>
    //     <CardContent>
    //       <h3 className="text-xl -mt-6 mb-6">Metrics</h3>
    //       <table className="w-full text-sm text-left text-gray-300">
    //         {/* <thead className="text-xs uppercase bg-black rounded-xl">
    //           <tr className=" *:border rounded-xl *:border-gray-700">
    //             <th className="px-6 py-3 ">Month</th>
    //             <th className="px-6 py-3">Sales Volume</th>
    //             <th className="px-6 py-3">Revenue (in $)</th>
    //           </tr>
    //         </thead> */}
    //         <tbody>
    //           {metricsData.map((row) => (
    //             <tr key={`${row.metric}-${row.value1}`} className="border-b bg-black *:border *:border-gray-700">
    //               <td className="px-6 py-4 w-full max-w-[250px]">{row.metric}</td>
    //               <td className="px-6 py-4">{row.value1}</td>
    //               {/* <td className="px-6 py-4">{row.value2}</td> */}
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </CardContent>
    //   </Card>
    // </div>

    // <div className='flex flex-col gap-4'>
    //   <h3 className="text-xl  mb-6">Metrics</h3>
    //   {["Revenue", "Profit Margin", "Customer Satisfaction", "Employee Satisfaction"].map((row, index)=>(
    //     <div key={index} className={`w-full flex border border-dashBoardButtonBg ${index === 0 ? "rounded-tl-md rounded-tr-md" : ""}`}>
    //       <div className='w-full max-w-[250px] border-r border-dashBoardButtonBg'>{row}</div>
    //       <div className='w-full  border-r border-dashBoardButtonBg'>{metricesData.core[index]}</div>
    //     </div>
    //   ))}

    // </div>

    <div className="flex flex-col">
      <h3 className="text-xl mt-2 mb-6 font-bold">Metrics</h3>
      {Object.entries(metricesData.core).map(([key, value], index) => (
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
      {Object.entries(metricesData.department).map(([key, value], index) => (
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

// export type { MetricsTabProps }
export default MetricsTab;
