
import { FaChevronLeft, FaChevronRight, FaSync } from "react-icons/fa";

export default function FloatingNav({ onBack, onForward, onRefresh }: { onBack: () => void; onForward: () => void; onRefresh: () => void; }) {
  return (
    <div className="absolute bottom-4 right-4 bg-gray-800 opacity-50 p-3 rounded-xl flex space-x-3 shadow-lg text-white">
      <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-lg">
        <FaChevronLeft size={10} />
      </button>
      <button onClick={onRefresh} className="p-2 hover:bg-gray-700 rounded-lg">
        <FaSync size={10} />
      </button>
      <button onClick={onForward} className="p-2 hover:bg-gray-700 rounded-lg">
        <FaChevronRight size={10} />
      </button>
    </div>
  );
}
