"use client"; // Mark as a client component

import { usePathname } from "next/navigation";
import SideBarMain from "./SideBar/SideBarMain";

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login"); // Check if it's login page

  return (
    <>
      {!isLoginPage ? <SideBarMain>{children}</SideBarMain> : children}
    </>
  );
}
