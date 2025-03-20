export interface Node {
  id: string;
  name: string;
  type: string;
  properties: string[];
  columns: string | null;
  attributes: string | null;
  document: string | null;
}

export interface Edge {
  source: string;
  target: string;
  type: string;
  description: string;
}

export interface HierarchicalData {
  nodes: Node[];
  edges: Edge[];
  jsx_code: string;
  topic: string;
  topic_id: number;
  narration: string;
}

export interface TeachingVisualizationResponse {
  message: string;
  data: HierarchicalData;
  status: string;
  status_code: number;
}


export interface TemporaryVisualization {
  nodes: Node[];
  edges: Edge[];
  jsx_code: string;
  topic: string;
  narration: string;
  narration_timestamps: [];
  animation_states:[];
  node_id:null;
}