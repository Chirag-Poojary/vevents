import Navbar from "@/src/components/Navbar";
import StatusCard from "@/src/components/StatusCard";
import Login from "./login/page";
import CreateProposal from "./dashboard/committee/CreateProposal";

export default function Home() {
  return (
    <>
    <Navbar/>
    {/* <Login/> */}
    {/* <CreateProposal/> */}
      <StatusCard/>
    </>
  );
}
