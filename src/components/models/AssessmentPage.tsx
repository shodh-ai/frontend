import { useState } from "react";
import { StudentAssessmentModelTab , StudentAssessmentButton } from "@/src/app/student/assessment/models/AssessmentMode";

export function useAssessmentModelPage(){

    const AssessmentsTabs: StudentAssessmentModelTab[] =[
        {label:"Loop Function Assignment", icon: '/dashboardReferenceIcon.svg'},
        {label:"Loop Transfer Function Topic Disscussion", icon: '/dashboardNotesIcon.svg'},
    ];
    const ResumeButtons : StudentAssessmentButton[]=[
      {label:"Continue Here", icon: '/assessment/playIcon.svg'},
        {label:"", icon: '/assessment/GotoIcon.svg'},
        {label:"Save for later", icon: '/assessment/SaveLaterIcon.svg'},

    ]

    const [activeTab, setActiveTab] = useState<number>(0);
    
      const handleSelectTab = (tabIndex: number) => {
        setActiveTab(tabIndex);
      };
    

    return {AssessmentsTabs,ResumeButtons, activeTab, handleSelectTab};
};