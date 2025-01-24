export interface DashBoardModel{
    label:string;
    value:number;
    improvement:string;
    improvFlag:boolean;
}

export interface AssignmentAssigned{
    name:string;
    taskStatus:string,
    deadline:string;
    priorityLevel:string;
}

export interface LeaderShipScoreAll{
    rank:number;
    name:string;
    accuracy:number;
    criticalthinking:number;
    overallScore:number;
}

export interface ResumeSection{
    title:string,
    description:string,
}