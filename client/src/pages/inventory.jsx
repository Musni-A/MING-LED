import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PartDetails from "./componants/partDeatails";
import AddParts from "./componants/addParts";

export default function Inventory(){
  const [show, setShow] = useState(false)
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loggedIn = localStorage.getItem('loggedIn');
    useEffect(()=>{
      if(!loggedIn){
        navigate('/')
      }
    })

  return<>
  <div className=" flex h-screen bg-[#e0edfa] font-sans relative">
    <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar setSidebarOpen={setSidebarOpen}/>
      <div className="h-full flex justify-between"
        onClick={() => setSidebarOpen(false)}>
        {show &&
          <div onClick={()=>setShow(false)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className=" p-6 rounded-xl shadow-2xl border border-gray-200 
         transition-all duration-300 ease-out 
         
         opacity-100 scale-95
         
         popover-open:opacity-100 popover-open:scale-100

         backdrop:transition-all backdrop:duration-300
         backdrop:bg-black/50 backdrop:opacity-0 
         popover-open:backdrop:opacity-100" onClick={(e)=>{e.stopPropagation()}}><AddParts setShow={setShow}/></div>
          </div>
        }
        <div className="h-full w-full sm:overflow-y-auto flex flex-col gap-5 sm:px-6 sm:py-4 p-2"
          onClick={() => setSidebarOpen(false)}>
            <PartDetails setShow={setShow}/>
        </div>
      </div>
    </div>
  </div>
  </>
}