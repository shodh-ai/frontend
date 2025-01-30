"use client";
import Image from "next/image";
import React from "react";
import { useSidebarViewModel } from "../models/SideBarTabModel";

interface Props {
  handleSideBarTab: () => void;
}
export default function SideBarExpand({ handleSideBarTab }: Props) {
  const { sideBarExpandTabs, activeTab, handleSelectTab } =
    useSidebarViewModel();
  return (
    <div className="min-h-[100vh] min-w-[216px] py-5 flex  items-center flex-col gap-4 sticky left-0 text-white bg-black z-20">
      <div className="flex items-center gap-3 ">
        <Image
          src={"/mainDrawer.svg"}
          alt="dashboardSymbol"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => handleSideBarTab()}
        />
        <div className="flex gap-1">
          <Image
            src={"/ShodhLogo.svg"}
            alt="dashboardSymbol"
            width={24}
            height={24}
          />
          <div className="text-[21.32px]">Shodh AI</div>
        </div>
      </div>
      <div className="flex flex-col pt-2 gap-3 overflow-x-hidden">
        {sideBarExpandTabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer flex items-center gap-3 text-[var(--Content-Primary-static)] animate-slide-left p-3 ${
              activeTab === index
                ? "bg-mainBackcolor rounded-lg text-white"
                : ""
            }`}
            onClick={() => handleSelectTab(index)}
          >
            <Image
              src={`${tab.icon}.svg`}
              alt={tab.label}
              width={24}
              height={24}
              style={{ color: "white" }}
            />

            <div className="text-sm font-semibold">{tab.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
