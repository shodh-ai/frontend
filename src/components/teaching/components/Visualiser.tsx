import { Visualisation } from './Visualisation';
import RowHandler from './RowHandler';

function get_elements({ rows, visualization }: { rows: number[] | number, visualization: Visualisation }) {
  if (Array.isArray(rows)) {
    return rows.map((row) => visualization.elements[row - 1]);
  } else {
    return visualization.elements[rows - 1];
  }
}

export default function Visualiser({ visualization, currIndex }: { visualization: Visualisation, currIndex: number }) {
  return (
    <div className='flex flex-col h-full w-full p-4 gap-2'>
      {visualization.layout.map((_, index) => (
        <RowHandler key={index} rows={visualization.layout[index]} elements={get_elements({ rows: visualization.layout[index], visualization })} index={currIndex} />
      ))}
    </div>
  );
}