import React from 'react';
import { motion } from 'framer-motion';
import { MdCheckCircleOutline } from 'react-icons/md';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="border bg-black rounded-lg p-6 max-w-md w-full mx-4 flex flex-col items-center"
      >
        <MdCheckCircleOutline size="5em" className='text-green-500' />
        <h2 className="text-xl font-bold mt-6">You nailed it, well done!</h2>
        <p className="text-gray-600 mb-6">
          Have questions? Ask now or click continue.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 border text-white rounded "
          >
            Got Questions?
          </button>
          <button
            onClick={onClose}
            className="px-4 rounded py-2 bg-blue-500 hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompletionModal;