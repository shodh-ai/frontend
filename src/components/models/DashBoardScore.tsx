import { DashBoardModel, AssignmentAssigned , LeaderShipScoreAll, ResumeSection } from "@/src/app/student/dashboard/models/DashboardModel";

export function useDashboardSemesterScore (){
    const ScoreTerms: DashBoardModel[] = [
        {label: 'Overall Score', value:64.05, improvement:"+2% improved", improvFlag:true},
        {label: 'Accuracy', value:85.76, improvement:"-1.5% improved", improvFlag:false},
        {label: 'Critical Thinking Skills', value:90.67, improvement:"+3% improved", improvFlag:true},
        {label: 'Total Time Spent', value:128, improvement:"+6% improved", improvFlag:true},


    ];

    const AssignmentTable:  AssignmentAssigned[] = [
        {name:"Root Locus Analysis", taskStatus:"Pending", deadline:"Jan 2, 2025", priorityLevel:"High"},
        {name:"Quiz: Poles and Zeros Fundamentals", taskStatus:"Not Started", deadline:"Jan 30, 2025", priorityLevel:"Medium"},
        {name:"Project: Stability Analysis Report", taskStatus:"In Progress", deadline:"Jan 10, 2025", priorityLevel:"Low"},
        {name:"Review: Asymptote Angles Formula", taskStatus:"Not Started", deadline:"Jan 8, 2025", priorityLevel:"Medium"},
        {name:"Prepare Presentation: Pole", taskStatus:"In Progress", deadline:"Jan 9, 2025", priorityLevel:"Low"},
        {name:"Prepare Presentation: Pole", taskStatus:"In Progress", deadline:"Jan 9, 2025", priorityLevel:"Low"},
        {name:"Prepare Presentation: Pole", taskStatus:"In Progress", deadline:"Jan 9, 2025", priorityLevel:"Low"},
    ];

    const LeaderShipTable: LeaderShipScoreAll[]=[
        {rank:1, name:"Matthew Wright", accuracy:94, criticalthinking:93, overallScore:2048},
        {rank:2, name:"Charlotte Evans", accuracy:93, criticalthinking:92, overallScore:2000},
        {rank:3, name:"Alexander Scott", accuracy:90, criticalthinking:89, overallScore:1988},
        {rank:124, name:"Kate Mott", accuracy:79, criticalthinking:89, overallScore:900},
        {rank:520, name:"Edward Thompson", accuracy:88, criticalthinking:85, overallScore:1974},

    ];


    const ResumeHere: ResumeSection[] = [
        {title:"Foundations of Artificial Intelligence", description:"Understanding Neural Networks : Explains how neural networks function & applications in AI."},
        {title:"Global Supply Chain Dynamics", description:"Introduces key cybersecurity concepts and strategies for modern businesses."},
        {title:"The Role of UX in Product Success", description:"Teaches predictive modelling and analysis using Python libraries like Pandas and Scikit-learn."},
        {title:"Data Visualization for Storytelling", description:"Covers tools and techniques to create compelling narratives using data visuals."},

    ];


    return {ScoreTerms, AssignmentTable, LeaderShipTable, ResumeHere};
}
