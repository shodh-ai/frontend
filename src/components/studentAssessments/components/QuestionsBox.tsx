"use client";
import Image from "next/image";
import React, { useState } from "react";
import QuestionDiscuss from "./QuestionDiscuss";

export default function QuestionsBox() {
  const [expandBox, setExpandBox] = useState<boolean>(false);
  return (
    <div className="border flex flex-col min-h-[664px] gap-3 border-[var(--Border-Secondary)] rounded-xl p-5 bg-black text-white ">
      {expandBox ? (
        <div className="flex flex-col gap-3">
          <Image
            src={"/assessment/rightArrowCircle.svg"}
            alt="image"
            height={24}
            width={24}
            className="cursor-pointer"
            onClick={() => setExpandBox(!expandBox)}
          />
          <div className=" w-[24px] tracking-widest  rotate-90  text-xs font-semibold text-assessmentTextColor">
            QUESTIONS
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between lg:max-w-[384px]  w-full">
            <div className="text-xs tracking-widest font-semibold text-assessmentTextColor">
              QUESTIONS
            </div>
            <Image
              src={"/assessment/leftArrowCircle.svg"}
              alt="image"
              height={24}
              width={24}
              className="cursor-pointer"
              onClick={() => setExpandBox(!expandBox)}
            />
          </div>

          <QuestionDiscuss />
        </div>
      )}
    </div>
  );
}
