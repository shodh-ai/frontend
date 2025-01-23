import React from "react";
import SemesterScore from "../components/SemesterScore";
import AssignmentAssigned from "../components/AssignmentAssigned";
import LeaderShipScore from "../components/LederShipScore";
import ResumeHereSection from "../components/ResumeHereSection";
import BackgroundBox from "@/src/lib/UI/BackgroundBox";

export default function StudentDash() {
  return (
    <div className="p-5 flex flex-col gap-6  ">
      <BackgroundBox>
        <SemesterScore />
      </BackgroundBox>
      <div className="w-full flex gap-5 max-lg:flex-col">
        <BackgroundBox width="w-full max-w-1/2">
          <AssignmentAssigned />
        </BackgroundBox>
        <BackgroundBox width="w-full max-w-1/2">
          <LeaderShipScore />
        </BackgroundBox>
      </div>
      <ResumeHereSection />
    </div>
  );
}
