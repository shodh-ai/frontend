"use client";
import React, { useState, ReactNode, useEffect } from "react";
import SideBarExpand from "./SideBarExpand";
import SidebarTab from "./SidebarTab";
import HeaderTop from "../header/HeaderTop";
import TemporaryDrawer from "./MobileSideBar";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/src/store";
import { useAppSelector } from "@/src/hooks/reduxHooks";
interface Props {
  children: ReactNode;
}

const SideBarMain = ({ children }: Props) => {
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [route, setRoute] = useState<string>("/");
  const router = useRouter();
  const {userData} = useAppSelector((state:RootState)=>state.auth);
  const pathname = usePathname();

  useEffect(() => {
    let initialTab = 0;
    if (pathname === "/student/teaching") {
      initialTab = 1;
    } else if (pathname.startsWith("/student/assessment")) {
      initialTab = 2;
    } else if (pathname.startsWith("/student/assignment-score")) {
      initialTab = 3;
    } else if (pathname.startsWith("/student/simulation")) {
      initialTab = 4;
    }

    setActiveTab(initialTab);
    setRoute(pathname);
  }, [pathname]);

 


  const handleSelectTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    let newRoute = "/";
    if(tabIndex === 1){
      newRoute = `/student/teaching`;
    }
    else if(tabIndex === 2){
      newRoute = `/student/assessment/${userData?.student_id}`;
    }
    else if(tabIndex === 3){
      newRoute = `/student/assignment-score/${userData?.student_id}`;
    }
    else if(tabIndex === 4){
      newRoute = `/student/simulation/${userData?.student_id}`;
    }
    setRoute(newRoute);
    router.push(newRoute);
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
