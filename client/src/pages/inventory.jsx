import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PartDetails from "./componants/partDeatails";

export default function Inventory(){
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const loggedIn = localStorage.getItem('loggedIn');
      useEffect(()=>{
        if(!loggedIn){
          navigate('/')
        }
      })

    return<>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans relative">
      <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar setSidebarOpen={setSidebarOpen}/>
        <div className="h-full flex justify-between"
          onClick={() => setSidebarOpen(false)}>
          <div className="h-full w-full overflow-y-auto flex flex-col gap-5 px-6 py-4"
            onClick={() => setSidebarOpen(false)}>
              <PartDetails/>
          </div>
        </div>
      </div>
    </div>
    </>
}