import { TextFrame } from './Visualisation';
import { isFrameVisible } from './frameChecker';

export default function TextFrameRenderer({ textFrame, index }: { textFrame: TextFrame, index: number }) {
  return (
    isFrameVisible(textFrame, index) ? (
      <div>
        {textFrame.text}
      </div>
    ) : null
  );
}