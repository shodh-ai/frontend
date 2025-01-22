"use client"
import Image from 'next/image'
import React from 'react'
import { TiArrowSortedDown } from "react-icons/ti";
import { useSidebarViewModel } from '../models/SideBarTabModel';
export default function HeaderTop({ title = "Dashboard", name="Kate Mott" }) {
    const { headerTabs } =  useSidebarViewModel();
  return (
    <div className="w-full p-5 flex text-white  justify-between  bg-black z-10">
          <div className="font-semibold text-xl">{title}</div>
          <div className="flex gap-5 items-center max-[400px]:hidden">
            {headerTabs.map((item, index) => (
              <Image
                src={`${item.icon}.svg`}
                alt={item.label}
                width={24}
                key={index}
                height={24}
              />
            ))}
            <div className="text-lg ">{name}</div>
            <TiArrowSortedDown />
          </div>
        </div>
  )
}
