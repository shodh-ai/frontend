export interface MetricChange {
  name:string,
  change: number;
  reason: string;
}

export interface Discussion {
  agent: string;
  content: string;
  metric_changes:  MetricChange[]; // Dynamic keys for metrics
}

export interface CoreMetrics {
  revenue: number;
  profit_margin: number;
  customer_satisfaction: number;
  employee_satisfaction: number;
}

export interface DepartmentMetrics {
  operational_efficiency: number;
  innovation: number;
  team_satisfaction: number;
  project_success_rate: number;
}

export interface Metrics {
  core: CoreMetrics;
  department: DepartmentMetrics;
}

export interface ImplementationStrategy {
  steps: string[];
  risks: string[];
}

export interface Decision {
  content: string;
  week: number;
  discussion: Discussion[];
}

export interface State {
  current_metrics: Metrics;
  current_week: number;
  current_department: string;
  current_decision: Decision | null;
  total_weeks: number;
  is_running: boolean;
}

export interface DecisionResponse {
  message: string;
  current_week: number;
  metrics: Metrics;
  discussion: Discussion[];
  implementation_strategy: ImplementationStrategy;
  state: State;
}

export interface SubmitSimulationRequest {
  content: string;
  state: State;
}


export interface DecisionId{
  decision_id:number,
}