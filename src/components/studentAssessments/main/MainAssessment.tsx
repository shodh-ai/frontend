"use client";
import React from "react";
import { useAssessmentModelPage } from "../../models/AssessmentPage";
import Image from "next/image";
import QuestionsBox from "../components/QuestionsBox";
import AnswerDiscussion from "../components/AnswerDiscussion";

export default function MainAssessment() {
  const { AssessmentsTabs, activeTab, handleSelectTab } =
    useAssessmentModelPage();
  return (
    <div className="p-5 flex  flex-col gap-2 text-white">
      <div className="flex gap-4 flex-wrap">
        {AssessmentsTabs.map((item, index) => (
          <div
            className={`flex max-w-[220px] items-center  gap-2 p-4 rounded-md cursor-pointer ${
              activeTab === index ? "bg-barBgColor" : "bg-black"
            }
           border border-dashBoardBorderColor`}
            onClick={() => handleSelectTab(index)}
            key={index}
          >
            <Image src={item.icon} alt="image" height={16} width={16} />
            <div className="text-ellipsis max-w-[200px] whitespace-nowrap overflow-hidden text-xs font-semibold w-full">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex max-lg:flex-col gap-4">
        <QuestionsBox/>
        <AnswerDiscussion/>
      </div>
    </div>
  );
}
