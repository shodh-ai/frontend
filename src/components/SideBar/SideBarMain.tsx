"use client";
import React, { useState, ReactNode, useEffect, useMemo } from "react";
import SideBarExpand from "./SideBarExpand";
import SidebarTab from "./SidebarTab";
import HeaderTop from "../header/HeaderTop";
import TemporaryDrawer from "./MobileSideBar";
import { useRouter } from "next/navigation";
import { RootState } from "@/src/store";
import { useAppSelector } from "@/src/hooks/reduxHooks";
interface Props {
  children: ReactNode;
}

const SideBarMain = ({ children }: Props) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const router = useRouter();
  const {userData} = useAppSelector((state:RootState)=>state.auth)

  useEffect(() => {
    if (activeTab === 1) {
      router.push(`/student/teaching`);
    } else if (activeTab === 2) {
      router.push(`/student/assessment/${userData?.student_id}`);
    } else if (activeTab === 3) {
      router.push(`/student/assignment-score/${userData?.student_id}`);
    } else if (activeTab === 4) {
      router.push(`/student/simulation/${userData?.student_id}`);
    } else {
      router.push("/");
    }
  }, [activeTab]);

  const handleSelectTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const handleSideBarTab = () => {
    setOpenSideBar(!openSideBar);
  };

  return (
    <div className="w-full flex">
      <div className="max-sm:hidden">
        {openSideBar ? (
          <SideBarExpand
            handleSideBarTab={handleSideBarTab}
            handleSelectTab={handleSelectTab}
            activeTab={activeTab}
          />
        ) : (
          <SidebarTab
            handleSideBarTab={handleSideBarTab}
            handleSelectTab={handleSelectTab}
            activeTab={activeTab}
          />
        )}
      </div>
      <div className="sm:hidden">
        <TemporaryDrawer
          handleSelectTab={handleSelectTab}
          activeTab={activeTab}
        />
      </div>
      <div className="w-full flex flex-col">
        <HeaderTop title="Dashboard" name="Kate Mott" />
        <div
          className={`h-[calc(100vh-68px)] ${
            openSideBar
              ? " sm:w-[calc(100vw-216px)] max-sm:w-[calc(100vw-75px)]"
              : "w-[calc(100vw-75px)]"
          } text-white overflow-auto bg-bakground-gradient`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideBarMain;
