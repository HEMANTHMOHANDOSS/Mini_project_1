import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import Link from "next/link";
import SignInDialog from "./SignInDialog";
import { Zap, Menu, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();
  const [openDialog, setOpenDialog] = useState(false);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setUserDetail(null);
    toast.success("Signed out successfully");
  };

  return (
    <header className="w-full p-4 flex items-center justify-between border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
      {/* Logo */}
      <Link href={'/'} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img 
          src="https://res.cloudinary.com/dkpwmrjkq/image/upload/v1759128371/Screenshot_20250929_121442_xzjiei.jpg" 
          alt="Z Flow Logo" 
          className="w-10 h-10 rounded-lg object-cover shadow-lg"
        />
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Z Flow
          </h1>
          <p className="text-xs text-gray-500 -mt-1">SRMIST</p>
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        {userDetail ? (
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                  <Image
                    src={userDetail.picture}
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-white">{userDetail.name}</p>
                    <p className="text-xs text-gray-400">{userDetail.email}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{userDetail.name}</p>
                  <p className="text-xs text-gray-400">{userDetail.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={toggleSidebar}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  Toggle Sidebar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setOpenDialog(true)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
            >
              Get Started
            </Button>
          </div>
        )}
        <SignInDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(v)}/>
      </div>
    </header>
  );
}

export default Header;