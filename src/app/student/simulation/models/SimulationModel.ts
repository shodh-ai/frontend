export interface ProjectDiscussionTabs{
    label:string,
}

interface TaskObjective {
    obj_text: string;
    objective_details: {
      object_id: number;
      object_text: string;
    }[];
  }
  

export interface TaskDiscussionTabs{
    task_name:string,
    task_details:string,
    task_objective:TaskObjective,
}

export interface TeamMembersTab{
    name:string,
    occupation:string,
    desc:string,
    icon:string,
}

export interface CompletionSimulationButton{
    label:string,
    icon:string,
}