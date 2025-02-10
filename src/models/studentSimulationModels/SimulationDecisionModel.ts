import { State } from "./SubmitSimulation";

export interface Metrics {
    core: {
      revenue: number;
      profit_margin: number;
      customer_satisfaction: number;
      employee_satisfaction: number;
    };
    department: {
      operational_efficiency: number;
      innovation: number;
      team_satisfaction: number;
      project_success_rate: number;
    };
  }
  
  export interface Challenge {
    department: string;
    situation: string;
  }
  
  export interface SimulationState {
    current_week: number;
    current_department: string;
    total_weeks: number;
    is_running: boolean;
  }
  
  export interface DecisioSimulationResponse {
    status: string; 
    message: string;
    metric_changes: Metrics;
    next_challenge: Challenge;
    state: SimulationState;
  }
  

  export interface HandleDecisionSimulationRequest {
    action: string;
    state: State;
  }
  
  export interface HandleSpecificDecisionSimulationRequest{
    action:string,
    feedback:string,
    specific_recommendations:string[],
    state:State,
  }