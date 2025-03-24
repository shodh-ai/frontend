import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatProps {
  label: string;
  value: string;
  trend: number;
  trendPeriod?: string;
}

const PerformanceStats = () => {
  const stats: StatProps[] = [
    {
      label: "Overall Score",
      value: "64.05%",
      trend: 2,
      trendPeriod: "from last week"
    },
    {
      label: "Accuracy",
      value: "85.76%",
      trend: -1.5,
      trendPeriod: "from last week"
    },
    {
      label: "Critical Thinking Skills",
      value: "90.67%",
      trend: 3,
      trendPeriod: "from last week"
    },
    {
      label: "Total Time Spent",
      value: "128 Hrs",
      trend: 6,
      trendPeriod: "from last week"
    }
  ];

  const StatItem = ({ label, value, trend, trendPeriod }: StatProps) => (
    <div className='pl-4 first:pl-0'>
      <h3 className="text-zinc-400 mb-2">{label}</h3>
      <div className="flex items-center mb-2">
        <span className="text-2xl font-semibold mr-2">{value}</span>
        <div className={`flex items-center ${trend > 0 ? 'bg-green-500' : 'bg-red-500'} text-black text-xs p-1 rounded-full`}>
          {trend > 0 ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
        </div>
      </div>
      <span className='text-sm'>{`${trend > 0 ? '+' : ''}${trend}% ${trendPeriod}`}</span>
    </div>
  );

  return (
    <div className="flex w-max gap-4 *:border-r *:border-zinc-700 *:pr-16">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};

export default PerformanceStats;