import React, { useEffect } from "react";
import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { getStudentAllLeadershipScore } from "@/src/features/student/studentThunks";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
export default function LeaderShipScore() {

  const {LeaderShipScoreData} = useSelector((state : RootState)=>state.student);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getStudentAllLeadershipScore())
      .unwrap()
      .then()
      .catch((Err) => console.error("Error while fetching", Err));
  }, [dispatch]);
  return (
    <>
      <div className="text-base font-semibold">Leadership Score</div>

      <div
        className={`side_scroll flex flex-col lg:overflow-y-auto max-lg:overflow-auto max-h-[265px] `}
      >
        <div className="flex gap-2  text-xs text-[var(--Content-Primary-static)] pt-2">
          <div className="w-full min-w-[50px]">Rank</div>
          <div className="w-full min-w-[120px]">Name</div>
          <div className="w-full min-w-[80px]">Accuracy</div>
          <div className="w-full min-w-[80px]">Critical Thinking</div>
          <div className="w-full min-w-[80px]">Overall Score</div>
        </div>
        {LeaderShipScoreData && LeaderShipScoreData.map((item, index) => (
          <div
            className="flex w-full items-center gap-2  text-xs py-3 border-b border-dashBoardBorderColor"
            key={index}
          >
            <div className="w-full min-w-[50px]">
              {index < 3 ? (
                <div className="max-w-[40px] w-full">
                  <button className="bg-dashBoardButtonBg rounded-3xl w-full text-[10px] py-[5px] px-[14px]">
                    {index+1}
                  </button>
                </div>
              ) : (
                <div>#{index+1}</div>
              )}
            </div>
            <div className="w-full min-w-[120px]">{item.student_name}</div>
            <div className="w-full min-w-[80px]">{item.accuracy}</div>
            <div className="w-full min-w-[80px]">{item.critical_thinking}</div>
            <div className="w-full min-w-[80px]">{item.overall_score}</div>
          </div>
        ))}
      </div>
    </>
  );
}
