import Image from "next/image";
import React from "react";
import style from '../common/ToggleButton.module.css'
import { getQuestions } from "./data";

export default function QuestionDiscuss({ title = "Open - Loop Function" }) {
  return getQuestions.map((item) => (
    <div className="flex flex-col py-3 gap-3" key={item.question_id}>
      <div className="border-dashBoardBorderColor border rounded-xl w-full flex flex-col ">
        <div className="bg-dashBoardBorderColor  text-xs flex justify-center p-4 rounded-tl-md rounded-tr-md">
          {title}
        </div>
        <div className="py-2 flex justify-center">
          <Image
            src={"/assessment/Question.svg"}
            alt="image"
            width={247}
            height={212}
          />
        </div>
      </div>

      <div className="text-sm font-semibold">{item.question_text}</div>
      <Image
        src={"/assessment/Question1.svg"}
        alt="image"
        width={244}
        height={84}
      />

      {item.subQuestions.map((question)=>(
        <div className="flex gap-2 rounded-md items-center p-3 bg-dashBoardBorderColor" key={question.subQuestion_id}>
          <input type="checkbox" id={`${question.subQuestion_id}`} className={style.container} />
          <label htmlFor={`${question.subQuestion_id}`} className="text-sm">{question.subQuestion_text}</label>
        </div>
      ))}
    </div>
  ));
}
