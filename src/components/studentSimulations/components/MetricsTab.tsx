import { Card, CardContent } from '@mui/material'
import React from 'react'

interface MetricRow {
  metric: string
  value1: number
  value2: number
}

interface MetricsTabProps {
  metricsData: MetricRow[]
}

const MetricsTab: React.FC<MetricsTabProps> = ({ metricsData }) => {
  return (
    <div className="overflow-x-auto">
      <Card sx={{ bgcolor: "black", color: "white" }}>
        <CardContent>
          <h3 className="text-xl -mt-6 mb-6">Metrics</h3>
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-black rounded-xl">
              <tr className=" *:border rounded-xl *:border-gray-700">
                <th className="px-6 py-3 ">Month</th>
                <th className="px-6 py-3">Sales Volume</th>
                <th className="px-6 py-3">Revenue (in $)</th>
              </tr>
            </thead>
            <tbody>
              {metricsData.map((row) => (
                <tr key={`${row.metric}-${row.value1}`} className="border-b bg-black *:border *:border-gray-700">
                  <td className="px-6 py-4">{row.metric}</td>
                  <td className="px-6 py-4">{row.value1}</td>
                  <td className="px-6 py-4">{row.value2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export type { MetricsTabProps }
export default MetricsTab