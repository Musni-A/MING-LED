import React from "react";
import { useState } from "react";
import { createUser } from "../../api/userAPI";
import toast, { Toaster } from 'react-hot-toast';



export default function RegisterPage({setShowForm}) {


  const empty = {
    name : '', username : '', age : '' , phoneNumber : '',
    department : '', jobRole : '', address : '',
    password : ''
  }

  const notify = (message, bg, color, icon ) => toast(message , {
      style : {
        background : bg,
        color : color,
      },
      icon : icon
    });

  const [form, setForm] = useState(empty)

  const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await createUser(form)
          console.log(response.data)
          setShowForm(false)
      } catch (err) {
        if(err){
          notify( "Can not create a user" ,"", "", "❌",);
        }
      }
  }

  return <>

      <div><Toaster></Toaster></div>
      {/* Card */}
      <div className=" bg-blue-950 p-10 rounded-2xl">

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">

            {/* Row 1 - Name & Username */}
            <div className="flex gap-4">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Full Name *</label>
                <input name="name" value={form.name} type="text" placeholder="Enter full name" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Username *</label>
                <input name="username" value={form.username} type="text" placeholder="Enter username" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
            </div>

            {/* Row 2 - Age & Phone */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Age</label>
                <input name="age" value={form.age} type="number" placeholder="Your age" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Phone Number</label>
                <input name="phoneNumber" value={form.phoneNumber} type="tel" placeholder="10-digit number" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
            </div>

            {/* Row 3 - Department & Job Role */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Department *</label>
                <select name="department" value={form.department} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ffffff] text-sm outline-none w-full">
                  <option value="">Select Department</option>
                  {["Admin", "Sales", "Factory"].map(o => (
                    <option key={o} className="bg-[#0d2145] text-white">{o}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Job Role *</label>
                <select name="jobRole" value={form.jobRole} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ffffff] text-sm outline-none w-full">
                  <option value="">Select Job Role</option>
                  {["Accountant", "Assist-Accountant", "Operation-Manager", "Head of Operation", "Componant Parts Store keeper", "Finishing Goods Store keeper", "Warranty Incharge", "Assemler", "Factory Manager", "Supervisor", "Sales man"].map(o => (
                    <option key={o} className="bg-[#0d2145] text-white">{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Address</label>
              <input name="address" value={form.address} type="text" placeholder="Enter your address" onChange={handleChange}
                className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
            </div>

            {/* Row 4 - Passwords */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Password *</label>
                <input name="password" value={form.password} type="password" placeholder="Min 6 characters" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Confirm Password *</label>
                <input type="password" placeholder="Repeat password" onChange={handleChange}
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>
            </div>

            <div className=" flex justify-end gap-2">
              <button className=" h-10 flex justify-center items-center mt-2 py-3.5 w-24 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity">
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