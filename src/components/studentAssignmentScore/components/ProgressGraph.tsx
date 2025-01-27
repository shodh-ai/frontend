"use client";
import React from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";

const SimpleLineChart = () => {
  const options: AgChartOptions = {
    background: {
      fill: "black",
    },
    data: getData(),
    series: [
      {
        type: "line", // Specify the series type explicitly
        xKey: "day",
        yKey: "progress",
        strokeWidth: 3,
        marker: {
          enabled: true,
          stroke: "white",
          fill: "white",
          strokeWidth: 5,
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        label: {
          color: "#FFFFFF",
          fontSize: 10,
        },
      },
      {
        type: "number",
        position: "left",
        label: {
          color: "#FFFFFF",
          fontSize: 10,
        },
      },
    ],
  };

  return (
    <div>
      <AgCharts
        options={options}
        className={"side_scroll min-w-[150px] max-[400px]:overflow-x-auto"}
      />
    </div>
  );
};

export default SimpleLineChart;
