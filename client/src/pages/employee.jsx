import { useEffect } from "react";
import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "./componants/userList";
import RegisterPage from "./componants/registerUserPage";

export default function Employee(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false)
    const naviagte = useNavigate();
    const loggedIn = localStorage.getItem("loggedIn")
    
    useEffect(()=>{
        if(!loggedIn){
            naviagte('/')
        }
    })
    return<>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans overflow-hidden relative">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Modal */}
            {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                onClick={() => setShowForm(false)}>
                <div className="transition-discrete p-6 rounded-xl shadow-2xl border border-gray-200 
                    transition-all duration-300 ease-out 
                    
                    opacity-100 scale-95
                    
                    popover-open:opacity-100 popover-open:scale-100

                    backdrop:transition-all backdrop:duration-300
                    backdrop:bg-black/50 backdrop:opacity-0 
                    popover-open:backdrop:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <RegisterPage setShowForm={setShowForm} />
                </div>
            </div>
            )}
            <TopBar setSidebarOpen={setSidebarOpen}/>
            <div className="h-full overflow-y-scroll sm:px-6 sm:py-4 p-2" onClick={() =>setSidebarOpen(false)}>
                <UserList setShowForm={setShowForm} />
            </div>
        </div>
    </div>
    </>
}