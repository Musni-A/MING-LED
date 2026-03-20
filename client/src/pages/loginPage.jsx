import { useState } from "react";
import { getUser } from "../api/userAPI";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


function LoginPage(){
  
  const notify = (message, bg, color, icon ) => toast(message , {
    style : {
      background : bg,
      color : color,
    },
    icon : icon
  });

  const navigate = useNavigate()

  const [form, setForm] = useState({username : "", password : ""})

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setForm( pre =>({...pre, [name] : value}))
        console.log(form)

  }

  const [login, setLogin] = useState(false)

  const handleSubmit = async (e)=>{
    setLogin(true)
    e.preventDefault()
    try{
      const response = await getUser(form);
      localStorage.setItem('name', response.data.user.name)
      localStorage.setItem('jobRole', response.data.user.jobRole)
      const loggedIn = response.data.loggedIn;
      localStorage.setItem('loggedIn', loggedIn)
      setLogin(false)

      if(loggedIn){
        navigate('/dashboard')
      }

    }
    catch(err)
    {
      setLogin(true)
      if(err){
        notify( "Invalid username and password" ,"", "", "❌",);
        setLogin(false)
      }
    }
  }
  
    return<>
    <div><Toaster/></div>
    <div className="min-h-screen bg-linear-to-br from-[#ffffff] via-[#e2ecff] to-[#bad2ff] flex items-center justify-center px-4 py-8 font-sans relative overflow-hidden">

      {/* Background circles */}
      <div className="absolute w-125 h-125 rounded-full -top-24 -right-24 pointer-events-none"
        style={{background:"radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 70%)"}} />
      <div className="absolute w-100 h-100 rounded-full -bottom-24 -left-12 pointer-events-none"
        style={{background:"radial-gradient(circle, rgba(245,200,0,0.05) 0%, transparent 70%)"}} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-150 bg-linear-to-br from-[#173249] via-[#173249] to-[#0b1449] backdrop-blur-xl border rounded-3xl p-10 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="flex items-end gap-1">
            <div className="w-2.5 h-9 rounded-full bg-[#e8192c]" />
            <div className="w-2.5 h-6 rounded-full bg-[#f5c800]" />
            <div className="w-2.5 h-9 rounded-full bg-[#0f4494]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-[0.2em] leading-none">MING</div>
            <div className="text-[0.6rem] text-[#7b9fd4] tracking-[0.3em] mt-0.5">WORTH SPENDING</div>
          </div>
        </div>
        
        <div className=" flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-5">Login</h2>
        </div>

        <div className="flex flex-col gap-4">

          <form onSubmit={handleSubmit}>
            {/* Row 1 - Username */}
            <div className=" flex flex-col gap-5">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Username *</label>
                <input name="username" value={form.username} onChange={handleChange} type="text" placeholder="Enter username"
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
              </div>

              {/* Row 4 - Passwords */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                  <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Password *</label>
                  <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Min 6 characters"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" />
                </div>

            {/* Submit */}
              <button className=" flex justify-center mt-2 w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity">
                { !login && "Login →"}
                { login && <img className="m-0 p-0 w-6" src="/barLoading.gif"></img>}
              </button>
            </div>
          </form>

          <p className="text-center text-[#6b7ea0] text-sm mt-1">
            Join the MING team today
          </p>

        </div>
      </div>
    </div>
    </>
}

export default LoginPage;