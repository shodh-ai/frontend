import React from 'react';
import Image from 'next/image';
import { XIcon } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imagePath: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imagePath }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-20">
      <div className="relative w-[50vw] h-[50vh]">
        <button
          className="absolute top-0 z-30 right-0 border bg-black/50 p-2 rounded-lg"
          onClick={onClose}
        >
          <XIcon size={20} />
        </button>
        <Image
          src={imagePath}
          alt="Enlarged view"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;