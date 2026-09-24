import { useState, useEffect } from "react";
import { getUser } from "../api/userAPI";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { LoaderIcon } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();

  
  // Role-based routing function
  const getDashboardRoute = (jobRole) => {
    const roleRoutes = {
      'manager': '/reports',
      'supervisor': '/employee',
      'Componant Parts Store keeper': '/inventory',
      'technician': '/inventory',
      'staff': '/Attendence',
      'Assist-Accountant' : '/employee'
    };
    
    // If jobRole exists in map, use it, otherwise default to /finishedGoods
    return roleRoutes[jobRole] || '/';
  };
  
  //  Redirect if already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    if (loggedIn) {
      const jobRole = localStorage.getItem("jobRole");
      navigate(getDashboardRoute(jobRole));
    }
  }, []);
  const [form, setForm] = useState({ username: "", password: "" });
  const [login, setLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLogin(true);

    try {
      const response = await getUser(form);
      const user = response.data.sendUser;
      console.log("User data received:", response.data);
      // Store user data
      localStorage.setItem("name", user.name);
      localStorage.setItem("jobRole", user.jobRole);
      localStorage.setItem("loggedIn", response.data.loggedIn);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userDepartment", user.department);
      
      setLogin(false);
      
      if (response.data.loggedIn) {
        // Navigate based on job role
        const dashboardRoute = getDashboardRoute(user.jobRole);
        navigate(dashboardRoute);
      }
    } catch (err) {
      setLogin(false);
      toast.error(err.response?.data?.Message || "Login failed. Please try again.");
    }
  };
  
  return (
    <>
      <div><Toaster/></div>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 flex items-center justify-center px-4 py-8 font-sans relative overflow-hidden">

        {/* Background gradient circles */}
        <div className="absolute w-96 h-96 rounded-full -top-32 -right-32 pointer-events-none"
          style={{background:"radial-gradient(circle, rgba(232,25,44,0.08) 0%, transparent 70%)"}} />
        <div className="absolute w-80 h-80 rounded-full -bottom-32 -left-32 pointer-events-none"
          style={{background:"radial-gradient(circle, rgba(245,200,0,0.06) 0%, transparent 70%)"}} />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-xl border border-white/50 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-end gap-1">
              <div className="w-2.5 h-9 rounded-full bg-[#e8192c]" />
              <div className="w-2.5 h-6 rounded-full bg-[#f5c800]" />
              <div className="w-2.5 h-9 rounded-full bg-[#0f4494]" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-[0.15em] leading-none">MING</div>
              <div className="text-[0.6rem] text-slate-500 tracking-[0.25em] mt-0.5 font-semibold">WORTH SPENDING</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
          </div>

          <div className="flex flex-col gap-4">

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-700 font-semibold">Username</label>
                  <input 
                    name="username" 
                    value={form.username} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Enter your username"
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none w-full placeholder:text-slate-400 focus:border-[#e8192c] focus:ring-2 focus:ring-red-100 transition-all" 
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-slate-700 font-semibold">Password</label>
                  <input 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    type="password" 
                    placeholder="Enter your password"
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none w-full placeholder:text-slate-400 focus:border-[#e8192c] focus:ring-2 focus:ring-red-100 transition-all" 
                  />
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  className="flex justify-center items-center mt-2 w-full py-3 rounded-lg text-white font-bold text-base cursor-pointer border-none bg-gradient-to-r from-[#e8192c] to-[#c0001f] shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
                >
                  { !login ? "Login →" : <LoaderIcon className="animate-spin" size={20} /> }
                </button>
              </div>
            </form>

            <p className="text-center text-slate-600 text-sm mt-2">
              Secure access for MING team members
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;