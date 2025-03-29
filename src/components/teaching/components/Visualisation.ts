type Optional<T> = T | null;

export type TextFrame = {
  text: string;
  start_order: number;
  end_order?: Optional<number>;
}

export type EquationFrame = {
  equation: string;
  start_order: number;
  end_order?: Optional<number>;
}

export type Element = {
  id: number;
  // type: 'text' | 'equation' | 'graph' | 'image' | 'table';
  type: string;
  frames: (TextFrame | EquationFrame)[];
}

export type Visualisation = {
  layout: (number | number[])[];
  elements: Element[];
}