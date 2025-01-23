import React from "react";
import BackgroundBox from "@/src/lib/UI/BackgroundBox";
import SemesterScore from "../../studentDashboard/components/SemesterScore";
import AssignmentAnalysis from "../components/AssignmentAnalysis";
import DailyProgressTrack from "../components/DailyProgressTrack";
import UpcomingAssignments from "../components/UpcomingAssignments";

export default function StudAssignmentMain() {
  return (
    <div className="p-5 flex flex-col gap-6">
      <BackgroundBox>
        <SemesterScore title="Topic Score" />
      </BackgroundBox>
      <div className="w-full flex gap-5 max-lg:flex-col">
        <BackgroundBox width="w-1/2">
          <AssignmentAnalysis />
        </BackgroundBox>
        <BackgroundBox width="w-1/2">
          <DailyProgressTrack />
        </BackgroundBox>
      </div>
      <BackgroundBox>
        <UpcomingAssignments />
      </BackgroundBox>
    </div>
  );
}
