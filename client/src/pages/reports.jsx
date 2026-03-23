import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";


export default function Reports(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return<>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans relative">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
            <TopBar setSidebarOpen={setSidebarOpen}/>
            <div className="h-full" onClick={() =>setSidebarOpen(false)}>
                <h1>Reports</h1>
            </div>
        </div>
    </div>
    </>
}