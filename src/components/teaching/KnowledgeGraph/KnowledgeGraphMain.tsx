"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch , useAppSelector} from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
import { getKnowledegeGrpahData } from "@/src/features/studentTeaching/studentTeachingThunks";

type Props = {
  setActiveSideTab: (index: number) => void;
};
export default function KnowledgeGraphMain({ setActiveSideTab }: Props) {
  const [expandedTopic, setExpandedTopic] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (id: string) => {
    setExpandedTopic((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const dispatch = useAppDispatch();
  const{TopicsData, TeachingVisualData,status} = useAppSelector((state:RootState)=>state.studentTeaching);
  useEffect(() => {
    dispatch(getKnowledegeGrpahData({ moduleId: 1, courseId: 2 }))
      .unwrap()
      .then()
      .catch((err) => console.error("Error while fetching", err));
  }, [dispatch]);

  if(status === "loading"){
    return <div className="flex justify-center ">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between text-assessmentTextColor">
        <div className="text-xs font-bold tracking-widest">KNOWLEDGE GRAPH</div>
        <Image
          src={"/CrossIcon.svg"}
          alt="cross image"
          height={16}
          width={16}
          className="cursor-pointer"
          onClick={() => setActiveSideTab(-1)}
        />
      </div>

      <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-3 gap-3 flex items-center justify-between rounded-md w-full">
        <Image src={"/SearchIcon.svg"} alt="image" width={16} height={16} />
        <input
          placeholder="Search"
          className="border-none focus:outline-none   bg-transparent w-full text-xs"
          type="text"
        />
      </div>

      <div
        className={
          "side_scroll flex flex-col gap-3 max-h-[570px] overflow-y-auto"
        }
      >
        {TopicsData && TopicsData.map((item) => {
          const topicKey = `topic_${item.topic.topicId}`;
          return (
            <div className="flex flex-col gap-2" key={topicKey}>
              <div
                className={`flex gap-2 p-2 cursor-pointer ${TeachingVisualData?.topic_id === item.topic.topicId ? "bg-barBgColor rounded-md" : ""}  `}
                onClick={() => toggleExpand(topicKey)}
              >
                {expandedTopic[topicKey] ? (
                  <Image
                    src={"/DownArrow.svg"}
                    alt="image"
                    width={16}
                    height={16}
                  />
                ) : (
                  <Image
                    src={"/RightArrow.svg"}
                    alt="image"
                    width={16}
                    height={16}
                  />
                )}
                <div className="text-xs text-[var(--Content-Primary-static)]">
                  {item.topic.title}
                </div>
              </div>
              {expandedTopic[topicKey] &&
                item.sub_topic.length > 0 &&
                item.sub_topic.map((sub) => {
                  const subtopicKey = `subtopic_${item.topic.topicId}_${sub.topicId}`;
                  return (
                    <div className="flex flex-col pl-3 " key={subtopicKey}>
                      <div
                        className={`flex gap-2 p-2 cursor-pointer ${TeachingVisualData?.topic_id === sub.topicId ? "bg-barBgColor rounded-md" : ""}  `}
                        onClick={() => toggleExpand(subtopicKey)}
                      >
                        {expandedTopic[subtopicKey] ? (
                          <Image
                            src={"/DownArrow.svg"}
                            alt="image"
                            width={16}
                            height={16}
                          />
                        ) : (
                          <Image
                            src={"/RightArrow.svg"}
                            alt="image"
                            width={16}
                            height={16}
                          />
                        )}
                        <div className="text-xs text-[var(--Content-Primary-static)]">
                          {sub.title}
                        </div>
                      </div>
                      {/* {expandedTopic[subtopicKey] &&
                        sub.subtopics.map((supersub, ind) => (
                          <div
                            className="text-xs text-[var(--Content-Primary-static)] pl-6  pt-3"
                            key={ind}
                          >
                            {supersub}
                          </div>
                        ))} */}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
