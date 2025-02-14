import Image from "next/image";
import { knowledgeGraphData } from "./data";
import { useState } from "react";
type Props={
  setActiveSideTab: (index:number) => void;
}
export default function KnowledgeGraphMain({setActiveSideTab}:Props) {
  const [expandedTopic, setExpandedTopic] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (id: string) => {
    setExpandedTopic((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
          onClick={()=>setActiveSideTab(-1)}
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

      <div className={"side_scroll flex flex-col gap-4 max-h-[570px] overflow-y-auto"}>
        {knowledgeGraphData.map((item) => {
          const topicKey = `topic_${item.topic_id}`;
          return (
            <div className="flex flex-col gap-3" key={topicKey}>
              <div
                className="flex gap-2 cursor-pointer"
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
                  {item.topic_name}
                </div>
              </div>
              {expandedTopic[topicKey] &&
                item.subtopics.length > 0 &&
                item.subtopics.map((sub) => {
                  const subtopicKey = `subtopic_${item.topic_id}_${sub.subtopic_id}`;
                  return (
                    <div className="flex flex-col pl-3 py-1" key={subtopicKey}>
                      <div
                        className="flex gap-2 cursor-pointer"
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
                          {sub.subtopic_name}
                        </div>
                      </div>
                      {expandedTopic[subtopicKey] &&
                        sub.subtopics.map((supersub, ind) => (
                          <div
                            className="text-xs text-[var(--Content-Primary-static)] pl-6  pt-3"
                            key={ind}
                          >
                            {supersub}
                          </div>
                        ))}
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
