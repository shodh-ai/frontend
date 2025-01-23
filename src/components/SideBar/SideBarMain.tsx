"use client";
import React, { useState } from "react";
import SideBarExpand from "./SideBarExpand";
import SidebarTab from "./SidebarTab";

export default function SideBarMain() {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  const handleSideBarTab = () => {
    setOpenSideBar(!openSideBar);
  };
  return (
    openSideBar ? 
      <SideBarExpand   handleSideBarTab={handleSideBarTab} />
      :
      <SidebarTab  handleSideBarTab={handleSideBarTab} />
  
  );
}
