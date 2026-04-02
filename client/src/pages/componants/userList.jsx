import { useState } from "react";
import { deleteUser, getAllUsers } from "../../api/userAPI";
import { useEffect } from "react";
import  toast, {Toaster} from "react-hot-toast";

export default function UserList({setShowForm}) {

  const notify = (message,icon)=>{toast(message, { icon : icon } )}

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  // const jobRole = localStorage.getItem('jobRole')

  
  const handleDelete = async (id) =>{
    setDeleteId(id)
    try{
      const response = await deleteUser(id);
      console.log(response.data);
      notify(`Deleted User ${response.data.deleteUser.name}`,"✅")

    }
    catch(err){
      notify(err,"❌")
    }
    finally{
      setDeleteId(null)
    }
  } 
  
  useEffect(()=>{
    getAllUsers()
    .then((res)=>{setUsers(res.data)})
    .catch((err)=>{console.log(err)})
    .finally(()=>setLoading(false))
  },[])

  const DEPT_COLORS = {
    IT:          "bg-[#0d2145]/10 text-[#0d2145]",
    Engineering: "bg-[#7b9fd4]/20 text-[#3a6ea8]",
    Finance:     "bg-[#f5c800]/20 text-[#a07c00]",
    Sales:       "bg-[#e8192c]/10 text-[#e8192c]",
    Admin:       "bg-green-100 text-green-700",
    Factory:       "bg-blue-100 text-blue-700",
  };

  const ROLE_COLORS = {
    Developer:  "bg-blue-50 text-blue-700",
    Manager:    "bg-purple-50 text-purple-700",
    Supervisor:    "bg-yellow-50 text-yellow-700",
    Executive:  "bg-red-50 text-red-600",
    Admin : "bg-green-50 text-green-700",
  };

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const totalPages = Math.ceil(users.length / itemsPerPage)

  const currentItems = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

  
  return <>
    <div className="bg-white md:mx-6 md:my-4 md:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

    <div><Toaster/></div>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-[#0d2145]">Employee List</h2>
          <p className="text-xs text-slate-400 mt-0.5">{users.length} total employees</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
            <span className="text-slate-400 text-xs">🔍</span>
            <input
              placeholder="Search employees..."
              className="bg-transparent text-xs outline-none text-slate-600 w-36 placeholder:text-slate-400"
            />
          </div>
          {/* Add button */}
          {<button onClick={()=>setShowForm(true)} className="bg-[#0d2145] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
            + Add Employee
          </button>}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block ">
      {loading && <div className="flex justify-center"><img className="" src="/loading.gif" alt="" width={150} /></div>}
      {!loading && <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Address</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentItems.map((user, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                {/* Employee */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0d2145] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0d2145] text-sm">{user.name}</div>
                      <div className="text-xs text-slate-400">@{user.username}</div>
                    </div>
                  </div>
                </td>
                {/* Department */}
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${DEPT_COLORS[user.department] || "bg-slate-100 text-slate-600"}`}>
                    {user.department}
                  </span>
                </td>
                {/* Job Role */}
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${ROLE_COLORS[user.jobRole] || "bg-slate-100 text-slate-600"}`}>
                    {user.jobRole}
                  </span>
                </td>
                {/* Phone */}
                <td className="px-6 py-4 text-xs text-slate-500">{user.phoneNumber}</td>
                {/* Address */}
                <td className="px-6 py-4 text-xs text-slate-500">{user.address}</td>
                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-semibold text-[#0d2145] bg-[#0d2145]/10 px-3 py-1.5 rounded-lg hover:bg-[#0d2145]/20 transition-colors">
                      Edit
                    </button>
                    <button
                        onClick={() => handleDelete(user._id)}
                        className="text-xs font-semibold text-[#e8192c] w-15 flex justify-center bg-[#e8192c]/10 px-3 py-1.5 rounded-lg hover:bg-[#e8192c]/20 transition-colors"
                    >
                        {deleteId === user._id
                            ? <img className="w-4" src="/barLoading.gif"/>
                            : "Delete"
                        }
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden divide-y divide-slate-100">
      {loading && <div className="flex justify-center"><img className="" src="/loading.gif" alt="" width={150} /></div>}
      {!loading && currentItems.map((user, i) => (
          <div key={i} className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d2145] text-white font-bold text-sm flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-[#0d2145] text-sm">{user.name}</div>
                  <div className="text-xs text-slate-400">@{user.username}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-semibold text-[#0d2145] bg-[#0d2145]/10 px-3 py-1.5 rounded-lg">Edit</button>
                <button onClick={()=>handleDelete(user._id)} className="text-xs flex justify-center w-15 font-semibold text-[#e8192c] bg-[#e8192c]/10 px-3 py-1.5 rounded-lg">
                  {deleteId === user._id
                    ? <img className="w-4" src="/barLoading.gif"/>
                    : "Delete"
                  }
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${DEPT_COLORS[user.department] || "bg-slate-100 text-slate-600"}`}>
                {user.department}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[user.jobRole] || "bg-slate-100 text-slate-600"}`}>
                {user.jobRole}
              </span>
              <span className="text-xs text-slate-400 px-2.5 py-1">📞 {user.phoneNumber}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Showing {users.length} of {users.length} employees</span>
        {/* Pagination buttons */}
            <div className="text-xs flex items-center gap-2 justify-center">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}>
                    ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button className={`text-xs px-3 py-1.5 rounded-lg bg-[#0d2145] text-white font-semibold ${currentPage === page
                    ? "bg-slate-300 text-[#0d2145]"
                    : "bg-slate-900 text-[#0146c5]"  
                  }`}
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
                    >
                        {page}
                    </button>
                ))}
                <button className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}>
                    Next →
                </button>
            </div>
      </div>

    </div>
    </>
}