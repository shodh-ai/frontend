"use client";
import React from "react";
import Image from "next/image";
import { useSidebarViewModel } from "../models/SideBarTabModel";
interface Props {
  handleSideBarTab: ()=>void,
}
export default function SidebarTab({handleSideBarTab} : Props){
  const { tabs, activeTab, handleSelectTab } = useSidebarViewModel();

  
  return (
    <div className="min-h-[100vh] min-w-[75px] py-6 items-center sticky top-0 left-0 flex flex-col gap-4 bg-black z-20">
      <Image
        src={"/mainDrawer.svg"}
        alt="dashboardSymbol"
        width={24}
        height={24}
        className="cursor-pointer"
        onClick={()=>handleSideBarTab()}
      />
      <div className="flex flex-col gap-3">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer p-3 animate-slide-left ${
              activeTab === index ? "bg-mainBackcolor rounded-xl" : ""
            }`}
            onClick={() => handleSelectTab(index)}
          >
            <Image
              src={`${tab.icon}.svg`}
              alt={tab.label}
              width={24}
              height={24}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
