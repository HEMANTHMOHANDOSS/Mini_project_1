import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";
import Link from "next/link";

function AppSideBar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Link href={"/"}>
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://res.cloudinary.com/dkpwmrjkq/image/upload/v1759128371/Screenshot_20250929_121442_xzjiei.jpg" 
              alt="Z Flow Logo" 
              className="w-12 h-12 rounded-lg object-cover shadow-lg"
            />
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Z Flow
              </h2>
              <p className="text-xs text-gray-500">SRMIST</p>
            </div>
          </div>
        </Link>
        <Button className="mt-5">
          <MessageCircleCode /> Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSideBar;