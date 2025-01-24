import React from 'react';
import { motion } from 'framer-motion';
import { MdErrorOutline } from 'react-icons/md';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="border rounded-lg bg-black p-6 max-w-md w-full mx-4 flex flex-col items-center"
      >
        <MdErrorOutline size="5em" className='text-red-500' />
        <h2 className="text-xl font-bold mt-6">Are you sure about that?</h2>
        <p className="text-gray-600 mb-6">
          All progress in this session will be lost.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 border text-white rounded hover:bg-red-600 hover:border-red-600"
          >
            End Session
          </button>
          <button
            onClick={onClose}
            className="px-4 rounded py-2 bg-blue-500 hover:bg-blue-600"
          >
            Keep Going
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorModal;