"use client";
import React, { useState, ReactNode } from "react";
import SideBarExpand from "./SideBarExpand";
import SidebarTab from "./SidebarTab";
import HeaderTop from "../header/HeaderTop";
import TemporaryDrawer from "./MobileSideBar";

interface Props {
  children: ReactNode;
}

const SideBarMain = ({ children }: Props) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  const handleSideBarTab = () => {
    setOpenSideBar(!openSideBar);
  };

  return (
    <div className="w-full flex">
      <div className="max-sm:hidden">
        {openSideBar ? (
          <SideBarExpand handleSideBarTab={handleSideBarTab} />
        ) : (
          <SidebarTab handleSideBarTab={handleSideBarTab} />
        )}
      </div>
      <div className="sm:hidden">
        <TemporaryDrawer />
      </div>
      <div className="w-full flex flex-col">
        <HeaderTop title="Dashboard" name="Kate Mott" />
        <div
          className={`h-[calc(100vh-68px)] ${
            openSideBar ? " sm:w-[calc(100vw-216px)] max-sm:w-[calc(100vw-75px)]" : "w-[calc(100vw-75px)]"
          } text-white overflow-auto bg-bakground-gradient`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideBarMain;
