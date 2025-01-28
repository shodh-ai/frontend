import React, { useRef, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  TooltipProps
} from 'recharts'
import { Card } from '@mui/material'

interface DashboardTabProps {
  salesTimeRange: string;
  setSalesTimeRange: (range: string) => void;
  comparisonTimeRange: string;
  setComparisonTimeRange: (range: string) => void;
  salesData: Array<{
    day: string;
    value: number;
  }>;
  comparisonData: Array<{
    day: string;
    current: number;
    previous: number;
  }>;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  return (
    <div
      className="custom-tooltip"
      style={{
        background: "linear-gradient(90deg, #3B82F6, #06B6D4)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
      }}
    >
      <p>{payload[0].value}</p>
    </div>
  );
};

const TimeRangeTabs: React.FC<{
  selectedRange: string;
  onChange: (range: string) => void;
}> = ({ selectedRange, onChange }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const ranges = ["7 days", "30 days", "60 days"];

  useEffect(() => {
    const activeIndex = ranges.indexOf(selectedRange);
    const activeTabElement = tabsRef.current[activeIndex];
    if (activeTabElement) {
      const tabWidth = activeTabElement.offsetWidth;
      const tabLeft = activeTabElement.offsetLeft;
      setIndicatorStyle({
        width: `${tabWidth}px`,
        transform: `translateX(${tabLeft}px)`,
      });
    }
  }, [selectedRange]);

  return (
    <div className="relative bg-gray-900 rounded-lg p-1">
      <div className="flex space-x-2">
        {ranges.map((range, index) => (
          <button
            key={range}
            ref={(el) => { tabsRef.current[index] = el }}
            className={`relative z-10 px-4 py-2 rounded-lg text-sm transition-colors duration-200
              ${selectedRange === range ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => onChange(range)}
          >
            {range}
          </button>
        ))}
      </div>
      {/* Sliding Indicator */}
      <div
        className="absolute bottom-1 left-1 h-[calc(100%-8px)] bg-blue-600 rounded-md transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
    </div>
  );
};

const DashboardTab: React.FC<DashboardTabProps> = ({
  salesTimeRange,
  setSalesTimeRange,
  comparisonTimeRange,
  setComparisonTimeRange,
  salesData,
  comparisonData
}) => {
  return (
    <div className="space-y-8">
      <p className="text-xl">Dashboard</p>
      <div style={{ backgroundColor: "black", color: "white" }}>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3>Sales in Units</h3>
            <TimeRangeTabs
              selectedRange={salesTimeRange}
              onChange={setSalesTimeRange}
            />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Card sx={{ bgcolor: "black", color: "white" }}>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3>Sales Comparison</h3>
            <TimeRangeTabs
              selectedRange={comparisonTimeRange}
              onChange={setComparisonTimeRange}
            />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <defs>
                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93C5FD" stopOpacity={1} />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <Bar dataKey="current" fill="url(#currentGradient)" />
                <Bar dataKey="previous" fill="url(#previousGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardTab