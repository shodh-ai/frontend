import React from "react";
import { chat } from "./chat";
import { useAssessmentModelPage } from "../../models/AssessmentPage";
import Image from "next/image";

export default function ChatMain() {
  const { ResumeButtons } = useAssessmentModelPage();
  return (
    <div className="flex flex-col gap-3">
      {chat.map((text, index) => (
        <div key={index} className="mb-5 flex flex-col">
          {text.req && (
            <div className="w-fit max-w-[80%] self-start   text-sm  px-4 py-2 mb-2 shadow-md">
              {text.req}
            </div>
          )}
          {text.showResume === true && (
            <div className="w-full self-start flex flex-col gap-1  text-sm  px-4 py-2 mb-2 shadow-md">
              <div>Please select one of the options</div>
              <div className="flex gap-2">
                {ResumeButtons.map((button, index) => (
                  <button
                    className="w-full border hover:bg-[#566FE9] rounded-md max-w-[140px] gap-2 p-3 flex items-center border-[var(--Border-Secondary)]"
                    key={index}
                  >
                    <Image
                      src={button.icon}
                      alt="image"
                      height={16}
                      width={16}
                    />
                    <div className="text-xs">
                      {index === 1 ? text.gotoText : button.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {text.res && (
            <div className="w-fit max-w-[80%] self-end bg-barBgColor  text-sm rounded-lg px-4 py-3 shadow-md">
              {text.res}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
