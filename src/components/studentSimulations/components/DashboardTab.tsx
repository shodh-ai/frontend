import React from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
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
            <div className="flex space-x-2">
              {["7 days", "30 days", "60 days"].map((range) => (
                <button
                  key={range}
                  className={`px-4 py-2 rounded-lg text-sm ${salesTimeRange === range ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  onClick={() => setSalesTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] ">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Card sx={{ bgcolor: "black", color: "white" }}>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3>Sales Comparison</h3>
            <div className="flex space-x-2">
              {["7 days", "30 days", "60 days"].map((range) => (
                <button
                  key={range}
                  className={`px-4 py-2 rounded-lg text-sm ${comparisonTimeRange === range ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  onClick={() => setComparisonTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="current" fill="#3B82F6" />
                <Bar dataKey="previous" fill="#93C5FD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DashboardTab