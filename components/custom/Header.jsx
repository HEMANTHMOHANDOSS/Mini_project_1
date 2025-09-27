import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import Link from "next/link";
import SignInDialog from "./SignInDialog";

function Header() {
  const { userDetail } = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();
  const [openDialog, setOpenDialog] = useState();

  return (
    <header className="w-full p-4 flex items-center justify-between border-b">
      <Link href={'/'}>
        <Image src={"/logo.png"} alt="Logo" width={200} height={200} />
      </Link>
      
      <div className="flex items-center gap-4">
        {userDetail ? (
          <div className="flex items-center gap-4">
            <Image
              src={userDetail.picture}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              onClick={toggleSidebar}
            />
          </div>
        ) : (
          <>
            <Button variant="ghost">Sign In</Button>
            <Button
              className="text-white"
              style={{
                backgroundColor: Colors.BLUE,
              }}
            >
              Get Started
            </Button>
          </>
        )}
        <SignInDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(v)}/>
      </div>
    </header>
  );
}

export default Header;