"use client";
import React from "react";
import SidebarTab from "@/src/components/SideBar/SidebarTab";
import HeaderTop from "@/src/components/header/HeaderTop";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex">
      <SidebarTab />
      <div className="w-full flex flex-col ">   
        <HeaderTop title="Dashboard" name="Kate Mott" />  
        <div className="h-[calc(100vh-68px)] overflow-auto">{children}</div>
      </div>
    </div>
  );
}
