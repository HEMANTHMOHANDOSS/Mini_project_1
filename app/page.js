import Hero from "@/components/custom/Hero";
import Dashboard from "@/components/custom/Dashboard";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext } from "react";

export default function Home() {
  return (
    <div className="mx-auto max-h-screen overflow-hidden">
      <HomeContent />
    </div>
  );
}

function HomeContent() {
  const { userDetail } = useContext(UserDetailContext);

  if (userDetail) {
    return <Dashboard />;
  }

  return (
    <div className="mx-auto max-h-screen overflow-hidden">
      <Hero />
    </div>
  );
}