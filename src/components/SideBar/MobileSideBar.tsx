import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Image from "next/image";
import { useSidebarViewModel } from "../models/SideBarTabModel";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  //   const toggleDrawer = (newOpen: boolean) => () => {
  //     setOpen(newOpen);
  //   };

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const { sideBarExpandTabs, activeTab, handleSelectTab } =
    useSidebarViewModel();

  const DrawerList = (
    <Box
      sx={{
        "& .MuiDrawer-paper": {
          width: {
            xs: "40%",
            md: "500px",
          },
          minWidth: "250px",
        },
      }}
      role="presentation"
    >
      <div className="min-h-[100vh] min-w-[216px] py-5 flex  items-center flex-col gap-4 sticky left-0 text-white bg-black z-20">
        <div className="flex items-center gap-3 ">
          <Image
            src={"/mainDrawer.svg"}
            alt="dashboardSymbol"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={()=>setOpen(false)}
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
              onClick={() => {
                handleSelectTab(index);
                setOpen(false);
              }}
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
    </Box>
  );

  return (
    <div className="min-h-[100vh] min-w-[75px] py-6 items-center sticky top-0 left-0 flex flex-col gap-4 bg-black z-20">
      <Image
        src={"/mainDrawer.svg"}
        alt="dashboardSymbol"
        width={24}
        height={24}
        className="cursor-pointer"
        onClick={toggleDrawer}
      />
      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
