import React from 'react';

interface FlowStepsProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const FlowSteps: React.FC<FlowStepsProps> = ({ steps, currentStep, onStepClick }) => {
  if (!steps.length) return null;

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      onStepClick(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      onStepClick(currentStep - 1);
    }
  };

  return (
    <div className="absolute right-4 top-4 w-96 bg-white/90 rounded-lg p-4 overflow-y-auto max-h-[80vh] z-40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Teaching Flow</h3>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className={`px-3 py-1 rounded ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <button
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
            className={`px-3 py-1 rounded ${
              currentStep === steps.length - 1
                ? 'bg-gray-200 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <div className="mb-2 text-sm text-gray-600">
        Step {currentStep + 1} of {steps.length}
      </div>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
              currentStep === index ? 'bg-blue-100' : ''
            }`}
            onClick={() => onStepClick(index)}
          >
            <span className="font-medium text-gray-600 min-w-[24px]">{index + 1}.</span>
            <span className="text-gray-800">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FlowSteps;