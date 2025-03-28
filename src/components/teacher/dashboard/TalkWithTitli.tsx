import React from 'react';
import { SparklesIcon, XIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface TalkWithTitliProps {
  isImageEnlarged: boolean;
  setIsImageEnlarged: (value: boolean) => void;
  onClose: () => void;
}

// Dummy student data for the graph
const studentData = [
  { day: 'Mon', value: 55 },
  { day: 'Tue', value: 78 },
  { day: 'Wed', value: 62 },
  { day: 'Thu', value: 48 },
  { day: 'Fri', value: 26 },
  { day: 'Sat', value: 82 },
  { day: 'Sun', value: 94 }
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
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
      <p className="text-white">{`${payload[0].value}`}</p>
    </div>
  );
};

const GraphComponent = ({ isEnlarged }: { isEnlarged: boolean }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={studentData}>
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
);

const TalkWithTitli: React.FC<TalkWithTitliProps> = ({
  isImageEnlarged,
  setIsImageEnlarged,
  onClose
}) => {
  return (
    <div className='w-full lg:pl-4'>
      <div className='w-full flex flex-col items-end gap-4 h-full'>
        <button className='flex p-2 justify-center bg-zinc-950 w-full md:w-[200px] xl:w-[238px] rounded border border-zinc-700 gap-2'>
          <SparklesIcon />Talk with Titli
        </button>
        <div className="w-max">
          <div className="bg-zinc-950 border border-zinc-700 rounded-lg shadow-xl w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-zinc-800">
              <h3 className="font-semibold text-sm">TALK WITH TITLY</h3>
              <div className="text-zinc-400 cursor-pointer hover:text-white transition-colors" onClick={onClose}>
                <XIcon size={18} />
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto h-full">
              <div className="bg-zinc-950 rounded-lg mb-6">
                <div className="h-44 w-[300px] lg:w-[400px] relative cursor-pointer">
                  <GraphComponent isEnlarged={false} />
                  <button
                    className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 p-2 rounded-lg transition-colors"
                    onClick={() => setIsImageEnlarged(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-zinc-400 mb-3">Recommended Questions:</h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-2 rounded-lg cursor-pointer">
                    Show students who always submit late.
                  </div>
                  <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-2 rounded-lg cursor-pointer">
                    How many students completed [Assignment Name]?
                  </div>
                  <div className="bg-zinc-800 hover:bg-zinc-700 transition-colors p-2 rounded-lg cursor-pointer">
                    Which students frequently use the Talk with AI feature?
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-zinc-800">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Ask me anything!"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 focus:outline-none"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors p-2 rounded-lg ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged Graph Modal */}
      {isImageEnlarged && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-950 p-4 rounded-lg w-[80vw] h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Student Performance Graph</h3>
              <button 
                onClick={() => setIsImageEnlarged(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XIcon size={24} />
              </button>
            </div>
            <div className="h-[calc(100%-4rem)]">
              <GraphComponent isEnlarged={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalkWithTitli;