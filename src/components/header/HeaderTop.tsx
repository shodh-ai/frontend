"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useSidebarViewModel } from "../models/SideBarTabModel";
import { useAppDispatch } from "@/src/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import { setLogout } from "@/src/features/auth/authSlice";
export default function HeaderTop({ title = "Dashboard", name = "Kate Mott" }) {
  const { headerTabs } = useSidebarViewModel();
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(setLogout());
    Cookies.remove("token");
    router.push("/login");
  };
  return (
    <div className="w-full p-5 flex text-white  justify-between  bg-black top-0 sticky z-10">
      <div className="font-semibold text-xl">{title}</div>
      <div className="flex gap-4">
        <div className="flex gap-5 items-center max-[480px]:hidden">
          {headerTabs.map((item, index) => (
            <Image
              src={`${item.icon}.svg`}
              alt={item.label}
              width={24}
              key={index}
              height={24}
            />
          ))}
        </div>
        <div
          className="flex items-center gap-4 relative cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        >
          <div className="text-lg ">{name}</div>
          {showProfile ? <TiArrowSortedUp/>: <TiArrowSortedDown />}
          {showProfile && (
            <div className="flex-col top-8 max-w-[115px] w-full min-h-[80px] absolute border-[var(--Border-Secondary)] rounded-xl bg-black  text-black border  text-center">
              <div
                className=" text-white hover:font-semibold p-2 border-b-2 border-[var(--Border-Secondary)]"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
