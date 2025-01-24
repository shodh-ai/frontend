'use client'
import { motion } from 'framer-motion';

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const Switch = ({ isOn, onToggle }: SwitchProps) => {
  const toggleSwitch = () => {
    onToggle();
  };

  return (
    <div
      onClick={toggleSwitch}
      className={`w-16 h-8 flex items-center rounded-full cursor-pointer px-1 ${isOn ? "bg-blue-500" : "bg-gray-300"
        }`}
    >
      <motion.div
        className="w-4 h-4 bg-black rounded-full shadow-md"
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        initial={false}
        animate={{
          x: isOn ? 35 : 5,
        }}
      />
    </div>
  )
}

export default Switch;