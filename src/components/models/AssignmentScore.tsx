import {
  AssignmentAnalysisModel,
  UpcommingAssignmentsModel,
} from "@/src/app/student/assignment-score/models/AssignmentAnaluModel";

export function useAssignmentScorePageModel() {
  const AssignmentAnalysisTable: AssignmentAnalysisModel[] = [
    {
      title: "Breakaway Points Calculation",
      description:
        "Good effort! Focus more on solving  equations accurately to identify breakaway points.",
    },
    {
      title: "Root Locus Symmetry",
      description:
        "You have a solid understanding of symmetry rules, but remember to verify the real-axis segments carefully.",
    },
    {
      title: "Centroid Calculation",
      description:
        "Excellent work on centroids! Try applying the concept to more complex systems to strengthen your skills.",
    },
  ];

  const UpcomingAssignmentTable: UpcommingAssignmentsModel[] = [
    {
      name: "Assignment: Asymptote Angles",
      description:
        "Test your understanding of symmetry rules in root locus, including real-axis identification & Practice deriving and applying the formula.",
        dueDate:'Jan 8, 2025',
        status:"Resume",
        progressBar:40
    },
  ];

  return { AssignmentAnalysisTable , UpcomingAssignmentTable};
}
