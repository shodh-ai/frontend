"use client";
import React, { useEffect } from "react";
import SemesterScore from "../components/SemesterScore";
import AssignmentAssigned from "../components/AssignmentAssigned";
import LeaderShipScore from "../components/LederShipScore";
import ResumeHereSection from "../components/ResumeHereSection";
import BackgroundBox from "@/src/lib/UI/BackgroundBox";
import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { getStudentDashboard } from "@/src/features/student/studentThunks";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/store";

export default function StudentDash() {
  const dispatch = useAppDispatch();
  // const {StudentData} = useSelector((state : RootState)=>state.student);

  

  useEffect(() => {
    dispatch(getStudentDashboard({ student_id: 1 }))
      .unwrap()
      .then()
      .catch((err) => console.error("Error while fetching", err));
  }, [dispatch]);
  return (
    <div className="p-5 flex flex-col gap-6  ">
      <BackgroundBox>
        <SemesterScore />
      </BackgroundBox>
      <div className="w-full flex gap-5 max-lg:flex-col">
        <BackgroundBox width="w-1/2">
          <AssignmentAssigned />
        </BackgroundBox>
        <BackgroundBox width="w-1/2">
          <LeaderShipScore />
        </BackgroundBox>
      </div>
      <ResumeHereSection />
    </div>
  );
}
