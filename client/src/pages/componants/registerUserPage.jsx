import React from "react";
import { useState } from "react";
import { createUser } from "../../api/userAPI";
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage({setShowForm}) {

  const empty = {
    name : '', username : '', age : '' , phoneNumber : '',
    department : '', jobRole : '', address : '',
    password : '', confirmPassword : ''
  }

  const [form, setForm] = useState(empty)
  // ADD THIS FOR POPUP
  const [showPopup, setShowPopup] = useState(false)

  const generateRandomCredentials = () => {
    const randomUsername = `${form.name + Math.random().toString(36).substr(2, 9)}`;
    const randomPassword = Math.random().toString(36).substr(2, 10);
    setForm(prev => ({
      ...prev,
      username: randomUsername,
      password: randomPassword,
      confirmPassword: randomPassword
    }));
  };

  const handleChange = (e) => {
      const { name, value } = e.target
      setForm(prev => ({ ...prev, [name]: value }))
      generateRandomCredentials();
      console.log(form)
  }

  // MODIFY THIS - Show popup instead of direct submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(form.password == form.confirmPassword){
      setShowPopup(true); // Show popup instead of direct create
      // setShowForm(false)
    }
    else{
      toast.error('Check passwords')
    }
  }

  // ADD THIS - Confirm create user
  const confirmCreateUser = async () => {
    try {
      const response = await createUser(form)
      console.log(response.data)
      setShowPopup(false)
      setShowForm(false)
      toast.success('User created successfully!')
    } catch (err) {
      if(err){
        toast.error("Can not create a user");
      }
    }
  }

  return <>

      <div><Toaster></Toaster></div>
      
      {/* ADD THIS - Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/5 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-950 rounded-2xl border-4 border-white p-6 max-w-md w-full mx-4">
            <div className="text-white text-2xl font-bold text-center pb-4">Confirm Employee Details</div>
            
            <div className="space-y-2 text-white text-sm">
              <p><span className="font-semibold text-[#7b9fd4]">Name:</span> {form.name}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Username:</span> {form.username}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Age:</span> {form.age || 'N/A'}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Phone:</span> {form.phoneNumber || 'N/A'}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Department:</span> {form.department}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Job Role:</span> {form.jobRole}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Address:</span> {form.address || 'N/A'}</p>
              <p><span className="font-semibold text-[#7b9fd4]">Password:</span> {form.password}</p>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={confirmCreateUser}
                className="h-10 px-4 rounded-xl text-white font-bold bg-green-600 hover:bg-green-700 transition-colors"
              >
                Confirm
              </button>
              <button 
                onClick={() => setShowPopup(false)}
                className="h-10 px-4 rounded-xl text-white font-bold bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div className={` bg-blue-950 p-7 rounded-2xl border-4 border-white ${showPopup && 'hidden'} `}>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="text-white text-2xl font-bold text-center pb-2">Add Employee</div>
            {/* Row 1 - Name & Username */}
            <div className="flex gap-4">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Full Name *</label>
                <input name="name" value={form.name} type="text" placeholder="Enter full name" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Age</label>
                <input name="age" value={form.age} type="number" placeholder="Your age" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
            </div>

            {/* Row 2 - Age & Phone */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Phone Number</label>
                <input name="phoneNumber" value={form.phoneNumber} type="tel" placeholder="10-digit number" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Department *</label>
                <select name="department" value={form.department} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ffffff] text-sm outline-none w-full">
                  <option value="">Select Department</option>
                  {["Admin", "Sales", "Factory"].map(o => (
                    <option key={o} className="bg-[#0d2145] text-white">{o}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Job Role *</label>
                <select name="jobRole" value={form.jobRole} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ffffff] text-sm outline-none w-full">
                  <option value="">Select Job Role</option>
                  {["Accountant", "Assist-Accountant", "Operation-Manager", "Head of Operation", "Componant Parts Store keeper", "Finishing Goods Store keeper", "Warranty Incharge", "Assemler", "Factory Manager", "Supervisor", "Sales man"].map(o => (
                    <option key={o} className="bg-[#0d2145] text-white">{o}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Address</label>
                <input name="address" value={form.address} type="text" placeholder="Enter your address" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
            </div>

            <div className=" flex justify-end gap-2">
              <button className="h-10 flex justify-center items-center mt-2 py-3.5 w-24 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity">
                Add
              </button>

              <p onClick={()=>setShowForm(false)} className="h-10 flex justify-center items-center text-center mt-2 py-3.5 w-24 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity">
                Cancel
              </p>
            </div>

            {/* Submit */}

          </div>
        </form>
        
      </div>
  </>
}