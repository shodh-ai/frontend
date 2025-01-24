import { useState } from "react";
import { StudentAssessmentModelTab } from "@/src/app/student/assessment/models/AssessmentMode";

export function useAssessmentModelPage(){

    const AssessmentsTabs: StudentAssessmentModelTab[] =[
        {label:"Loop Function Assignment", icon: '/dashboardReferenceIcon.svg'},
        {label:"Loop Transfer Function Topic Disscussion", icon: '/dashboardNotesIcon.svg'},
    ];

    const [activeTab, setActiveTab] = useState<number>(0);
    
      const handleSelectTab = (tabIndex: number) => {
        setActiveTab(tabIndex);
      };
    

    return {AssessmentsTabs, activeTab, handleSelectTab};
};