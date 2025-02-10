import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSimulationModel } from "../../models/SimulationPage";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
import { State } from "@/src/models/studentSimulationModels/SubmitSimulation";
import { useRouter } from "next/navigation";
import {
  handleSimulationDecision,
  submitSimulationStudent,
} from "@/src/features/studentSimulation/studentSimulationThunks";
import { setSubmitdataRespoonse } from "@/src/features/studentSimulation/studentSimulationSlice";
import { toast } from "react-toastify";
type Props = {
  handlesChatDiscuss: () => void;
  handleSelectTab: (tabIndex: number) => void;
};
export default function TeamChat({
  handlesChatDiscuss,
  handleSelectTab,
}: Props) {
  const { TemMembersDetails, SimulationCompButtons } = useSimulationModel();
  const router = useRouter();
  const { SimulationSubmitData } = useAppSelector(
    (state: RootState) => state.studentSimulation
  );

  const [content, setContent] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [showDecision, setShowDecision] = useState<boolean>(false);

  const handleChange = (e: string) => {
    setContent(e);
  };

  const handleSubmit = () => {
    setValue(content);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const {
    SimulationStartData,
    status,
    submitStatus,
    SimulationDecisionResponse,
  } = useAppSelector((state: RootState) => state.studentSimulation);

  const [state, setState] = useState<State | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "succeeded" && SimulationStartData?.state) {
      setState(SimulationStartData?.state as State);
    }
  }, [SimulationStartData, status]);

  useEffect(() => {
    if (state !== null && value !== "") {
      dispatch(submitSimulationStudent({ content: value, state })).catch(
        (err) => console.error("Error submitting simulation", err)
      );
    }
  }, [value, state, dispatch]);

  useEffect(() => {
    if (SimulationSubmitData && showDecision) {
      dispatch(
        handleSimulationDecision({
          action: "discuss_specific",
          feedback: value,
          specific_recommendations: ["operational cost impact"],
          state: SimulationSubmitData.state,
        })
      )
        .then(()=>setShowDecision(false))
        .catch((err) => console.error("Error while fetching", err));
    }
  }, [showDecision, value, SimulationSubmitData, dispatch]);

  const handleSinulationAction = (index: number) => {
    if (index === 0 && SimulationSubmitData) {
      dispatch(
        handleSimulationDecision({
          action: "accept_all",
          state: SimulationSubmitData.state,
        })
      )
        .then(() => handleSelectTab(0))
        .catch((err) => console.error("Error while fetchibg", err));
      dispatch(setSubmitdataRespoonse());
    } else if (index === 1) {
      dispatch(setSubmitdataRespoonse());
      setShowDecision(true);
    } else {
      if (SimulationSubmitData) {
        dispatch(
          handleSimulationDecision({
            action: "end_session",
            state: SimulationSubmitData.state,
          })
        )
          .then()
          .catch((err) => console.error("Error while fetchibg", err));

        dispatch(setSubmitdataRespoonse());
        router.push("/student/dashboard/1");
      }
    }

    if (SimulationDecisionResponse) {
      toast.info(SimulationDecisionResponse?.message);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col   gap-3 side_scroll w-full h-[500px]  overflow-y-auto">
        <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-3 gap-4 flex items-center justify-between rounded-md w-full">
          <Image
            src={"/LeftArrow.svg"}
            alt="image"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => handlesChatDiscuss()}
          />
          <div className="flex items-center gap-4 w-full cursor-pointer">
            <Image
              src={TemMembersDetails[3].icon}
              alt="image"
              height={36}
              width={36}
            />

            <div className="text-sm font-semibold">
              {TemMembersDetails[3].name}
            </div>
          </div>
        </div>

        {value && (
          <div className="w-fit max-w-[80%] self-end bg-barBgColor mr-2 text-sm rounded-lg px-4 py-2 shadow-md">
            {value}
          </div>
        )}

        {submitStatus === "loading" && (
          <div className="m-2 text-center">Loading.....</div>
        )}
        {SimulationSubmitData &&
          SimulationSubmitData.discussion.map((member, index) => (
            <div
              key={index}
              className="mb-5 flex flex-col gap-2 w-full max-w-[90%] self-start   text-sm  px-4 py-1  shadow-md p-1 border border-dashBoardBorderColor"
            >
              <div className="text-sm font-semibold text-assessmentTextColor">
                {member.agent}
              </div>
              {member.metric_changes != null &&
                member.metric_changes.map((item, ind) => (
                  <div key={ind}>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="flex w-full">
                      <div className="max-w-[100px] text-sm  text-[var(--Content-Primary-static)]  w-full">
                        Change:
                      </div>
                      <div className="text-sm">{item.change}</div>
                    </div>
                    <div className="flex w-full">
                      <div className="max-w-[100px] text-sm  text-[var(--Content-Primary-static)]  w-full">
                        Reason:
                      </div>
                      <div className="text-sm">{item.reason}</div>
                    </div>
                  </div>
                ))}
            </div>
          ))}

        {SimulationSubmitData && (
          <div className="w-full self-start border border-barBgColor flex flex-col gap-3  text-sm mt-3 px-4 py-2 mb-2 shadow-md">
            <div>
              Kindly inform me if the execution plan works for you or you would
              prefer any changes.
            </div>
            <div className="flex gap-2 max-sm:flex-wrap">
              {SimulationCompButtons.map((button, index) => (
                <button
                  className="w-full border hover:bg-[#566FE9] rounded-md max-w-[160px] gap-2 p-3 flex items-center border-[var(--Border-Secondary)]"
                  key={index}
                  onClick={() => handleSinulationAction(index)}
                >
                  <Image src={button.icon} alt="image" height={16} width={16} />
                  <div className="text-xs">{button.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex  text-xs">
        <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] border-r-0 p-3 max-sm:p-1 flex items-center justify-between rounded-tl-md rounded-bl-md w-full">
          <div className="flex gap-3 w-full">
            <Image
              src={"/UploadFileIcon.svg"}
              alt="image"
              height={24}
              width={24}
            />
            <input
              placeholder="Ask me anything!"
              className="border-none focus:outline-none   bg-transparent w-full text-nowrap"
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              value={content}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Image
            src={"/SendIcon.svg"}
            className="cursor-pointer"
            alt="image"
            height={32}
            width={32}
            onClick={handleSubmit}
          />
        </div>
        <div className="flex justify-around items-center p-3 max-sm:p-1 b w-full max-w-[119px] max-sm:max-w-[40px] bg-barBgColor rounded-tr-md rounded-br-md">
          <Image src={"/TalkIcon.svg"} alt="image" height={32} width={32} />
          <div className="max-sm:hidden">Talk to me</div>
        </div>
      </div>
    </div>
  );
}
