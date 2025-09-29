"use client";
import Hero from "@/components/custom/Hero";
import Dashboard from "@/components/custom/Dashboard";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="mx-auto max-h-screen overflow-hidden">
      <HomeContent />
    </div>
  );
}

function HomeContent() {
  const { userDetail } = useContext(UserDetailContext);
  const { setOpen } = useSidebar();

  // Close sidebar on home page
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  if (userDetail) {
    return <Dashboard />;
  }

  return (
    <div className="mx-auto max-h-screen overflow-hidden">
      <Hero />
    </div>
  );
}