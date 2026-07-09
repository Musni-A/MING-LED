import Profile from "./componants/profile";
import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";
import AttendanceMarking from "./componants/userAttendence";
import { Toaster } from "react-hot-toast";

export default function Attendence(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return<>
    <Toaster/>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans relative">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
            <TopBar setSidebarOpen={setSidebarOpen}/>
            <div className="h-full overflow-y-auto" onClick={() =>setSidebarOpen(false)}>
                <AttendanceMarking/>
            </div>
        </div>
    </div>
    </>
}