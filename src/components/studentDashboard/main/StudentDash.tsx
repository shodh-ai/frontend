"use client";
import React, { useEffect, useState } from "react";
import SemesterScore from "../components/SemesterScore";
import AssignmentAssigned from "../components/AssignmentAssigned";
import LeaderShipScore from "../components/LederShipScore";
import ResumeHereSection from "../components/ResumeHereSection";
import BackgroundBox from "@/src/lib/UI/BackgroundBox";
import { useAppDispatch , useAppSelector} from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
import { getStudentDashboard } from "@/src/features/student/studentThunks";


export default function StudentDash() {

  const storedData = localStorage.getItem("student");
  const userData = storedData ? JSON.parse(storedData) : null;
  const dispatch = useAppDispatch();
 
  useEffect(() => {
    dispatch(getStudentDashboard({ student_id: userData?.facultyId }))
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
