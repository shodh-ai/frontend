import {
  ProjectDiscussionTabs,
  TaskDiscussionTabs,
  TeamMembersTab,
  CompletionSimulationButton,
} from "@/src/app/student/simulation/models/SimulationModel";
import { useState } from "react";

export function useSimulationModel() {
  const SinulationProjectTabs: ProjectDiscussionTabs[] = [
    { label: "Project Brief" },
    { label: "Team Discussion" },
    { label: "History" },
  ];

  const TemMembersDetails: TeamMembersTab[] = [
    {
      name: "Emma Stone",
      occupation: "CEO",
      desc: "Positive: Users appreciate TaskMaster’s stability and scalability.",
      icon: "/simulation/TeamProfile.svg",
    },
    {
      name: "Olivia Green",
      occupation: "Head of Product",
      desc: "Let’s prioritize them. Start by suggesting how we can mitigate timeline risks.",
      icon: "/simulation/TeamProfile1.svg",
    },
    {
      name: "David Wright",
      occupation: "Frontend Developer Lead",
      desc: "Customers might take time to adopt AI-driven features, leading to a slower ROI.",
      icon: "/simulation/TeamProfile2.svg",
    },
    {
      name: "Product Team Group",
      occupation: "",
      desc: "David: For now, I’ll prepare a milestone plans. Let me know if there’s anything else you need.",
      icon: "/simulation/TeamProfile.svg",
    },
  ];

  const SimulationCompButtons: CompletionSimulationButton[] = [
    { label: "Approve", icon: "/simulation/ApproveIcon.svg" },
    { label: "Revise Plan", icon: "/simulation/RevisePlan.svg" },
  ];
  const TaskDiscussionDetails: TaskDiscussionTabs[] = [
    {
      task_name: "Welcome to Marketing Simulation: Managing Segments",
      task_details:
        "NexonTech Solutions is a leading SaaS product development company with a proven track record in the industry. The company generates $150 million annually, and its flagship product, TaskMaster, is widely used by enterprises for productivity and task management. However, the company is facing an unprecedented challenge as a new competitor, AIWorkX, has entered the market. AIWorkX has introduced an innovative productivity assistant powered by artificial intelligence, which automates task assignments, detects project bottlenecks, and provides predictive insights for project management. Their solution is gaining traction rapidly, with a staggering 30% month-over-month growth, and is beginning to erode NexonTech’s market share.",
      task_objective: {
        obj_text: "As the Project Manager, your task is to:",
        objective_details: [
          {
            object_id: 1,
            object_text:
              "Analyze the situation and propose a strategy to integrate AI features into TaskMaster.",
          },
          {
            object_id: 2,
            object_text:
              "	Plan resource allocation, timelines, and budgets while ensuring minimal disruption to existing projects.",
          },
          {
            object_id: 3,
            object_text:
              "	Collaborate with stakeholders and teams to define project goals, tasks, and deliverables.",
          },
          {
            object_id: 4,
            object_text:
              "Launch the AI-enabled feature in 3 months to regain competitive edge.",
          },
        ],
      },
    },
  ];
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleSelectTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return {
    SinulationProjectTabs,
    SimulationCompButtons,
    TemMembersDetails,
    TaskDiscussionDetails,
    activeTab,
    handleSelectTab,
  };
}
