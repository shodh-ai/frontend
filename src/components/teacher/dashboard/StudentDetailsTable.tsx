import React from 'react';
import { Settings2, SearchIcon } from 'lucide-react';
import { studentData } from './StudentData';

interface StudentDetailsTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StudentDetailsTable: React.FC<StudentDetailsTableProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  // Filter students based on search query
  const filteredStudents = studentData.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.growth.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 md:items-center justify-between mb-2">
        <h2 className="text-lg">Student Details</h2>
        <div className="flex items-center gap-1 sm:gap-4">
          <button className="bg-zinc-800 hidden sm:block p-2 rounded-lg">
            <Settings2 size={24} />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg pl-10 sm:pr-4 py-2 w-max md:w-80  focus:outline-none"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>
      </div>

      {/* Table with scroll */}
      <div className="overflow-y-auto side_scroll overflow-x-auto h-[calc(100vh-26rem)]">
        <table className="w-full">
          <thead className="text-zinc-300">
            <tr className=''>
              <th className="py-3 text-left text-xs font-medium uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Overall Score (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Critical Thinking</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attendance (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submission Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Growth Insights</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-zinc-800/50">
                <td className="py-4 whitespace-nowrap text-sm">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{student.overallScore}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{student.criticalThinking}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{student.attendance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{student.submissionRate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{student.deadline}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    student.growth === 'Excellent' ? 'bg-blue-950/30 text-blue-500' :
                    student.growth === 'Improving' ? 'bg-green-950/30 text-green-500' :
                    student.growth === 'Consistent' ? 'bg-yellow-950/30 text-yellow-500' :
                    'bg-red-950/30 text-red-500'
                  }`}>
                    {student.growth}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDetailsTable;