import React, { useState } from "react";
import { createUser } from "../../api/userAPI";
import toast, { Toaster } from "react-hot-toast";
import { fetchUserData } from "../commonFun/fetchData";

import { 
  UserPlus, 
  User, 
  Hash, 
  Phone, 
  Building, 
  Briefcase, 
  MapPin, 
  Lock, 
  RefreshCw, 
  Copy, 
  Check, 
  X, 
  Key, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function RegisterPage({ setShowForm, setLoading, setUsers }) {
  const empty = {
    name: "",
    username: "",
    age: "",
    phoneNumber: "",
    department: "",
    jobRole: "",
    address: "",
    password: "",
    confirmPassword: ""
  };

  const [form, setForm] = useState(empty);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegenerate = (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a full name first", { id: "name-missing" });
      return;
    }
    const cleanName = form.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomUsername = `${cleanName}${Math.random().toString(36).substr(2, 5)}`;
    const randomPassword = Math.random().toString(36).substr(2, 10);
    
    setForm(prev => ({
      ...prev,
      username: randomUsername,
      password: randomPassword,
      confirmPassword: randomPassword
    }));
    toast.success("Credentials regenerated!", { id: "regen-success" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate credentials on first name entry if username field is empty or matching auto-gen pattern
      if (name === "name") {
        if (value.trim()) {
          const cleanName = value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
          // Only generate if we don't already have a customized username
          const randomUsername = `${cleanName}${Math.random().toString(36).substr(2, 5)}`;
          const randomPassword = Math.random().toString(36).substr(2, 10);
          updated.username = randomUsername;
          updated.password = randomPassword;
          updated.confirmPassword = randomPassword;
        } else {
          updated.username = "";
          updated.password = "";
          updated.confirmPassword = "";
        }
      }
      return updated;
    });
  };

  const handleCopyCredentials = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    const text = `Username: ${form.username}\nPassword: ${form.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credentials copied!", { id: "copy-success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!form.department) {
      toast.error("Department is required");
      return;
    }
    if (!form.jobRole) {
      toast.error("Job Role is required");
      return;
    }
    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (form.age && (form.age < 16 || form.age > 100)) {
      toast.error("Age must be between 16 and 100");
      return;
    }

    if (form.password === form.confirmPassword) {
      setShowPopup(true);
    } else {
      toast.error("Passwords do not match");
    }
  };

  const confirmCreateUser = async () => {
    try {
      await createUser(form);
      setShowPopup(false);
      setShowForm(false);
      toast.success(`${form.name} registered successfully!`, {
        position: "top-right",
        duration: 3000,
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Cannot create user";
      toast.error(errorMessage);
    } finally {
      fetchUserData(setLoading, setUsers, toast);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <>
      <Toaster />
      <div className="relative">
          {!showPopup ? (
            <div
              key="register-form"
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-6 w-full max-w-lg overflow-hidden animate-scaleIn"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Add New Employee</h3>
                    <p className="text-xs text-slate-400 font-medium">Register profile and generate secure credentials</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name & Age */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-350"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      Age
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        name="age"
                        type="number"
                        value={form.age}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-350"
                        placeholder="Age"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Department */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        name="phoneNumber"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-350"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      Department *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Department</option>
                        {["Admin", "Sales", "Factory"].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Job Role & Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      Job Role *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                      <select
                        name="jobRole"
                        value={form.jobRole}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Job Role</option>
                        {[
                          "Accountant", 
                          "Assist-Accountant", 
                          "Operation-Manager", 
                          "Head of Operation", 
                          "Componant Parts Store keeper", 
                          "Finishing Goods Store keeper", 
                          "Warranty Incharge", 
                          "Assemler", 
                          "Factory Manager", 
                          "Supervisor", 
                          "Sales man"
                        ].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-350"
                        placeholder="Enter Address"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto Generated Credentials card */}
                {form.name && (
                  <div
                    className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mt-2 space-y-2.5 relative overflow-hidden animate-slideUp"
                  >
                    <div className="absolute -right-6 -bottom-6 text-slate-100/60 pointer-events-none">
                      <Key size={80} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-indigo-500" />
                        Generated Login Credentials
                      </span>
                      <div className="flex gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={handleRegenerate}
                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 transition-colors"
                          title="Regenerate credentials"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyCredentials}
                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 transition-colors"
                          title="Copy credentials"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Username</div>
                        <div className="text-xs font-semibold text-slate-700 bg-white border border-slate-150 px-2.5 py-1.5 rounded-lg select-all truncate mt-1">
                          {form.username}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Temporary Password</div>
                        <div className="text-xs font-semibold text-slate-700 bg-white border border-slate-150 px-2.5 py-1.5 rounded-lg select-all truncate mt-1 font-mono">
                          {form.password}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] text-xs font-bold shadow-lg shadow-blue-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Review Profile
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Review & ID Badge Step */
            <div
              key="confirm-badge"
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md overflow-hidden text-center animate-scaleIn"
            >
              {/* Header */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Verify Employee Profile</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Please review the details before confirming registration</p>
              </div>

              {/* ID Badge Preview */}
              <div className="my-5 border border-slate-200/80 rounded-2xl bg-gradient-to-br from-[#0d2145] to-[#254275] p-5 text-white text-left relative overflow-hidden shadow-lg shadow-blue-900/10">
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Badge Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Employee ID Card</span>
                  <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">Valid</span>
                </div>

                {/* Badge Body */}
                <div className="flex gap-4">
                  {/* Photo Avatar */}
                  <div className="w-16 h-16 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-xl font-bold tracking-wide shrink-0">
                    {getInitials(form.name)}
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    <div>
                      <h4 className="font-bold text-sm tracking-wide leading-tight truncate">{form.name}</h4>
                      <p className="text-[10px] text-white/55 font-medium mt-0.5">@{form.username}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-white/40 block font-medium">Department</span>
                        <span className="font-semibold text-white/95 truncate block">{form.department}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block font-medium">Job Role</span>
                        <span className="font-semibold text-white/95 truncate block">{form.jobRole}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Metadata Details */}
                <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-3 text-[10px] font-medium text-white/70">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-white/30" />
                    <span>{form.phoneNumber || "No Phone"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-white/30 truncate" />
                    <span className="truncate">{form.address || "No Address"}</span>
                  </div>
                </div>
              </div>

              {/* Warning/Info Box */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-left text-[11px] text-slate-500 leading-relaxed mb-5">
                <span className="font-bold text-slate-700 block mb-0.5">Important Security Notice:</span>
                Make sure to copy the temporary password before confirming. This password will be stored securely and will not be displayed again.
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={confirmCreateUser}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/10 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm and Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="w-full h-10 rounded-xl hover:bg-slate-100 text-slate-500 font-bold text-xs transition-colors cursor-pointer"
                >
                  Go Back & Edit
                </button>
              </div>
            </div>
          )}
      </div>
    </>
  );
}