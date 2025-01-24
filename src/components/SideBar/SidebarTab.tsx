"use client";
import React from "react";
import Image from "next/image";
import { useSidebarViewModel } from "../models/SideBarTabModel";

export default function SidebarTab() {
  const { tabs, activeTab, handleSelectTab } =
    useSidebarViewModel();

  return (
    
      <div className="h-[100vh] min-w-[75px] py-6  flex items-center flex-col gap-4 bg-black z-10">
        <Image
          src={"/mainDrawer.svg"}
          alt="dashboardSymbol"
          width={24}
          height={24}
        />
        <div className="flex flex-col gap-3">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`cursor-pointer p-3 ${
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
