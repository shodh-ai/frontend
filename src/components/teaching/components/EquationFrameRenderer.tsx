import { EquationFrame } from './Visualisation';
import { isFrameVisible } from './frameChecker';
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

export default function EquationFrameRenderer({ equationFrame, index }: { equationFrame: EquationFrame, index: number }) {
  return (
    isFrameVisible(equationFrame, index) ? (
      <div>
        <TeX>{equationFrame.equation}</TeX>
      </div>
    ) : null
  );
}