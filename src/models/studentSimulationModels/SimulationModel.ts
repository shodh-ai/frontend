export interface Challenge {
  department: string;
  situation: string;
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

export interface State {
  current_metrics: Metrics;
  current_week: number;
  current_department: string;
  current_decision: string | null;
  total_weeks: number;
  is_running: boolean;
}

export interface SimulationResponse {
  message: string;
  current_week: number;
  challenge: Challenge;
  metrics: Metrics;
  state: State;
}
