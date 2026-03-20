import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";

export default function Attendence(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return<>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans overflow-hidden relative">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <TopBar setSidebarOpen={setSidebarOpen}/>
            <div className="h-full" onClick={() =>setSidebarOpen(false)}>
                <h1>Attendence</h1>
            </div>
        </div>
    </div>
    </>
}