import { Element } from './Visualisation';
import ElementHandler from './ElementHandler';

export default function RowHandler({ rows, elements, index }: { rows: number[] | number, elements: Element[] | Element, index: number }) {
  return (
    <div className="flex flex-row h-full w-full gap-2">
      {Array.isArray(rows) && Array.isArray(elements)
        ? rows.map((row, i) => <ElementHandler key={i} element={elements[i]} multi={true} index={index} />)
        : !Array.isArray(elements) && <ElementHandler element={elements} multi={false} index={index} />}
    </div>
  );
}