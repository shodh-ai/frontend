import Image from "next/image";
import React from "react";
// import ColorSwitches from '../common/ToggleButton'
import styles from "../common/ToggleButton.module.css";
import LinearDeterminate from "../common/ProgressBar";
import ChatMain from "./ChatMain";

export default function AnswerDiscussion({ title = "Open - Loop Function" }) {
  return (
    <div className="border flex flex-col justify-between min-h-[664px] gap-3 border-[var(--Border-Secondary)] rounded-xl w-full p-5 bg-black text-white">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-3 max-sm:flex-wrap">
          <div className="text-xs font-semibold tracking-widest">
            ANSWER DISCUSSIONS
          </div>
          <LinearDeterminate />
          <div className="flex gap-6 items-center">
            <Image
              src={"/assessment/saveIcon.svg"}
              alt="image"
              height={24}
              width={24}
            />
            <div className="flex gap-2 items-center">
              <div className="tracking-widest text-xs font-semibold">NOTES</div>
              <div className={styles.switch}>
                <input type="checkbox" id="toggle" />
                <label
                  htmlFor="toggle"
                  className={`${styles.slider} ${styles.slider_round}`}
                ></label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dashBoardBorderColor  text-xs flex justify-center p-4 rounded-tl-md rounded-tr-md">
          {title}
        </div>
      </div>
      <div className="side_scroll w-full h-full max-h-[478px] overflow-y-auto">
        <ChatMain/>
      </div>
      <div className="w-full flex  text-xs">
        <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] border-r-0 p-3 flex items-center justify-between rounded-tl-md rounded-bl-md w-full">
          <div className="flex gap-3 w-full">
            <Image src={"/UploadFileIcon.svg"} alt="image" height={24} width={24}/>
            <input placeholder="Ask me anything!" className="border-none focus:outline-none   bg-transparent w-full text-nowrap" type="text"/>
          </div>
          <Image src={"/SendIcon.svg"} alt="image" height={32} width={32}/>
        </div>
        <div className="flex justify-around items-center p-3 b w-full max-w-[119px] bg-barBgColor rounded-tr-md rounded-br-md"  >
        <Image src={"/TalkIcon.svg"} alt="image" height={32} width={32}/>
        <div >Talk to me</div>
        </div>
      </div>
    </div>
  );
}
