import React, { useState, useCallback } from 'react';
import { MdClose, MdUploadFile } from 'react-icons/md';

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileModal = ({ isOpen, onClose }: FileModalProps) => {
  const [files, setFiles] = useState<File[]>([]);
  
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.name.endsWith('.csv') || file.name.endsWith('.txt')
    );
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    // Handle file upload here
    console.log('Uploading files:', files);
    // Reset files after upload
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-black rounded-lg p-6 w-[500px] border max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size="1.5em" />
          </button>
        </div>

        <div 
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center"
        >
          <p className="text-gray-500">
            Drag and drop files here<br />
            <span className="text-sm">(.csv or .txt files only)</span>
          </p>
        </div>

        {files.length > 0 && (
          <div className="mb-4">
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center  py-2 rounded">
                  <div className='flex items-center gap-2'>
                  <button><MdUploadFile size="1.5em"/></button>
                  <span className="truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)}
                    className="text-white "
                  ><MdClose /></button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0}
          className={`w-full py-2 px-4 rounded ${
            files.length === 0 
              ? 'bg-gray-800 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileModal;