import Profile from "./componants/profile";
import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";

export default function UserProfile(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return<>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans relative">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
            <TopBar setSidebarOpen={setSidebarOpen}/>
            <div className="h-full overflow-y-scroll" onClick={() =>setSidebarOpen(false)}>
                <Profile/>
            </div>
        </div>
    </div>
    </>
}