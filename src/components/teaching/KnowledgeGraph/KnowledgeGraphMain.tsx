// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { useAppDispatch , useAppSelector} from "@/src/hooks/reduxHooks";
// import { RootState } from "@/src/store";
// import { getKnowledegeGrpahData } from "@/src/features/studentTeaching/studentTeachingThunks";

// type Props = {
//   setActiveSideTab: (index: number) => void;
//   // setCurrentTopic:(id:number)=>void;
// };
// export default function KnowledgeGraphMain({ setActiveSideTab  }: Props) {
//   const [expandedTopic, setExpandedTopic] = useState<{
//     [key: string]: boolean;
//   }>({});

//   const toggleExpand = (id: string) => {
//     setExpandedTopic((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // const selectTopic = (id:number)=>{
//   //   setCurrentTopic(id);
//   // }
//   const dispatch = useAppDispatch();
//   const{TopicsData, status, CurrentTopicId} = useAppSelector((state:RootState)=>state.studentTeaching);
//   useEffect(() => {
//     dispatch(getKnowledegeGrpahData({ moduleId: 1, courseId: 2 }))
//       .unwrap()
//       .then()
//       .catch((err) => console.error("Error while fetching", err));
//   }, [dispatch]);

//   if(status === "loading"){
//     return <div className="flex justify-center ">Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex justify-between text-assessmentTextColor">
//         <div className="text-xs font-bold tracking-widest">KNOWLEDGE GRAPH</div>
//         <Image
//           src={"/CrossIcon.svg"}
//           alt="cross image"
//           height={16}
//           width={16}
//           className="cursor-pointer"
//           onClick={() => setActiveSideTab(-1)}
//         />
//       </div>

//       <div className="bg-[#0D0D0D] border border-[var(--Border-Secondary)] p-3 gap-3 flex items-center justify-between rounded-md w-full">
//         <Image src={"/SearchIcon.svg"} alt="image" width={16} height={16} />
//         <input
//           placeholder="Search"
//           className="border-none focus:outline-none   bg-transparent w-full text-xs"
//           type="text"
//         />
//       </div>

//       <div
//         className={
//           "side_scroll flex flex-col gap-3 max-h-[480px]  overflow-y-auto"
//         }
//       >
//         {TopicsData && TopicsData.map((item) => {
//           const topicKey = `topic_${item.topic.topicId}`;
//           return (
//             <div className="flex flex-col gap-2" key={topicKey}>
//               <div
//                 className={`flex gap-2 p-2 cursor-pointer ${CurrentTopicId === item.topic.topicId ? "bg-barBgColor rounded-md" : ""}  `}
//                 onClick={() => toggleExpand(topicKey)}
//               >
//                 {expandedTopic[topicKey] ? (
//                   <Image
//                     src={"/DownArrow.svg"}
//                     alt="image"
//                     width={16}
//                     height={16}
//                   />
//                 ) : (
//                   <Image
//                     src={"/RightArrow.svg"}
//                     alt="image"
//                     width={16}
//                     height={16}
//                   />
//                 )}
//                 <div className="text-xs text-[var(--Content-Primary-static)]">
//                   {item.topic.title}
//                 </div>
//               </div>
//               {expandedTopic[topicKey] &&
//                 item.sub_topic.length > 0 &&
//                 item.sub_topic.map((sub) => {
//                   const subtopicKey = `subtopic_${item.topic.topicId}_${sub.topicId}`;
//                   return (
//                     <div className="flex flex-col pl-3 " key={subtopicKey}>
//                       <div
//                         className={`flex gap-2 p-2 cursor-pointer ${CurrentTopicId === sub.topicId ? "bg-barBgColor rounded-md" : ""}  `}
//                         onClick={() => {toggleExpand(subtopicKey); 
//                           // selectTopic(sub.topicId)
//                         }}
//                       >
//                         {expandedTopic[subtopicKey] ? (
//                           <Image
//                             src={"/DownArrow.svg"}
//                             alt="image"
//                             width={16}
//                             height={16}
//                           />
//                         ) : (
//                           <Image
//                             src={"/RightArrow.svg"}
//                             alt="image"
//                             width={16}
//                             height={16}
//                           />
//                         )}
//                         <div className="text-xs text-[var(--Content-Primary-static)]">
//                           {sub.title}
//                         </div>
//                       </div>
//                       {/* {expandedTopic[subtopicKey] &&
//                         sub.subtopics.map((supersub, ind) => (
//                           <div
//                             className="text-xs text-[var(--Content-Primary-static)] pl-6  pt-3"
//                             key={ind}
//                           >
//                             {supersub}
//                           </div>
//                         ))} */}
//                     </div>
//                   );
//                 })}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/reduxHooks";
import { RootState } from "@/src/store";
import { getKnowledegeGrpahData } from "@/src/features/studentTeaching/studentTeachingThunks";
import { setCurrentTopicId } from "@/src/features/studentTeaching/studentTeachingSlice";

type Props = {
  setActiveSideTab: (index: number) => void;
  setCurrentTopic: (topic: string) => void;
};

interface TopicIdMap {
  [key: number]: string;
}

export default function KnowledgeGraphMain({ setActiveSideTab, setCurrentTopic }: Props) {
  const [expandedTopic, setExpandedTopic] = useState<{ [key: string]: boolean }>({});
  const dispatch = useAppDispatch();
  const { TopicsData, status, CurrentTopicId } = useAppSelector((state: RootState) => state.studentTeaching);

  const TOPIC_ID_TO_VISUALIZATION: TopicIdMap = {
    1: "hierarchical",
    2: "er",
    3: "entity",
    4: "attribute",
    5: "hierarchical",
    6: "entity",
    7: "entity",
    8: "attribute",
    9: "er",
    10: "document",
    11: "document",
    12: "hierarchical",
    15: "relationalQuery",
    16: "relationalQuery",
    19: "queryprocessing",
    20: "queryprocessing",
    21: "shared_memory",
    22: "shared_disk",
    23: "shared_memory",
    24: "shared_nothing",
    25: "distributed_database",
    27: "oop_concepts",
    37:"gdp",
  };

  const getParentTopicId = (topicId: number): number | null => {
    if (!TopicsData) return null;
    for (const topic of TopicsData) {
      if (topic.topic.topicId === topicId) return topic.topic.topicId;
      for (const sub of topic.sub_topic) {
        if (sub.topicId === topicId) return topic.topic.topicId;
      }
    }
    return null;
  };

  const getFirstSubtopicWithVisualization = (parentTopicId: number): number | null => {
    if (!TopicsData) return null;
    const parentTopic = TopicsData.find((topic) => topic.topic.topicId === parentTopicId);
    if (parentTopic && parentTopic.sub_topic.length > 0) {
      for (const sub of parentTopic.sub_topic) {
        if (TOPIC_ID_TO_VISUALIZATION[sub.topicId]) {
          return sub.topicId;
        }
      }
    }
    return null;
  };

  const toggleExpand = (id: string) => {
    setExpandedTopic((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectTopic = (topicId: number) => {
    let effectiveTopicId = topicId;
    let visualizationName = TOPIC_ID_TO_VISUALIZATION[topicId];

    if (!visualizationName) {
      const firstSubtopicId = getFirstSubtopicWithVisualization(topicId);
      if (firstSubtopicId) {
        effectiveTopicId = firstSubtopicId;
        visualizationName = TOPIC_ID_TO_VISUALIZATION[firstSubtopicId];
      }
    }

    visualizationName = visualizationName || "er";
    dispatch(setCurrentTopicId(effectiveTopicId));
    setCurrentTopic(visualizationName);

    const parentTopicId = getParentTopicId(effectiveTopicId);
    if (parentTopicId) {
      const newExpanded = { [`topic_${parentTopicId}`]: true };
      setExpandedTopic(newExpanded);
    }

  }

  // Set initial state and fetch data
  useEffect(() => {
    
    // Set initial state immediately if CurrentTopicId is null (first load)
    if (CurrentTopicId === null) {
      dispatch(setCurrentTopicId(9));
      setCurrentTopic("er");
      setExpandedTopic({ topic_6: true });
      
    }

    // Fetch data and sync state
    dispatch(getKnowledegeGrpahData({ moduleId: 1, courseId: 2 }))
      .unwrap()
      .then(() => {
        console.log("Data fetched, CurrentTopicId:", CurrentTopicId, "TopicsData available:", !!TopicsData);
        const topicIdToUse = CurrentTopicId ?? 9; // Use persisted value or default to 9
        const parentTopicId = getParentTopicId(topicIdToUse);
        const visualizationName = TOPIC_ID_TO_VISUALIZATION[topicIdToUse] || "er";

        // Sync state after fetch
        setCurrentTopic(visualizationName);
        if (parentTopicId) {
          setExpandedTopic({ [`topic_${parentTopicId}`]: true });
          console.log("Restored expandedTopic after fetch:", { [`topic_${parentTopicId}`]: true });
        } else {
          console.log("No parent found for topicId:", topicIdToUse);
        }
      })
      .catch((err) => console.error("Error while fetching", err));
  }, [dispatch]); // Only run on mount


  if (status === "loading") {
    return <div className="flex justify-center">Loading...</div>;
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
          className="border-none focus:outline-none bg-transparent w-full text-xs"
          type="text"
        />
      </div>

      <div className={"side_scroll flex flex-col gap-3 max-h-[480px] overflow-y-auto"}>
        {TopicsData && TopicsData.map((item) => {
          const topicKey = `topic_${item.topic.topicId}`;
          return (
            <div className="flex flex-col gap-2" key={topicKey}>
              <div
                className={`flex gap-2 p-2 cursor-pointer ${CurrentTopicId === item.topic.topicId ? "bg-barBgColor rounded-md" : ""}`}
                onClick={() => {
                  toggleExpand(topicKey);
                  selectTopic(item.topic.topicId);
                }}
              >
                {expandedTopic[topicKey] ? (
                  <Image src={"/DownArrow.svg"} alt="image" width={16} height={16} />
                ) : (
                  <Image src={"/RightArrow.svg"} alt="image" width={16} height={16} />
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
                    <div className="flex flex-col pl-3" key={subtopicKey}>
                      <div
                        className={`flex gap-2 p-2 cursor-pointer ${CurrentTopicId === sub.topicId ? "bg-barBgColor rounded-md" : ""}`}
                        onClick={() => {
                          toggleExpand(subtopicKey);
                          selectTopic(sub.topicId);
                        }}
                      >
                        {expandedTopic[subtopicKey] ? (
                          <Image src={"/DownArrow.svg"} alt="image" width={16} height={16} />
                        ) : (
                          <Image src={"/RightArrow.svg"} alt="image" width={16} height={16} />
                        )}
                        <div className="text-xs text-[var(--Content-Primary-static)]">
                          {sub.title}
                        </div>
                      </div>
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