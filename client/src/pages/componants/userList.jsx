import { useState, useEffect } from "react";
import { deleteUser, updateUser } from "../../api/userAPI";
import toast, { Toaster } from "react-hot-toast";

import {
  LoaderCircleIcon,
  Search,
  Plus,
  X,
  User,
  Edit2,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Phone,
  MapPin,
  AlertTriangle,
  Building,
  Briefcase,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Hash
} from "lucide-react";
import { fetchUserData } from "../commonFun/fetchData";
import RegisterPage from "./registerUserPage";

const TRANSLATIONS = {
  deleteEmployee: "Delete Employee",
  deleteConfirmPrefix: "Are you sure you want to permanently delete ",
  deleteConfirmSuffix: "? This action is irreversible.",
  cancel: "Cancel",
  yesDelete: "Yes, Delete",
  deleting: "Deleting..."
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Custom interactive state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editUser, setEditUser] = useState(null);
  const [isDeletingUser, setIsDeletingUser] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchUserData(setLoading, setUsers, toast);
  }, []);

  const confirmDelete = async (id) => {
    setDeleteId(id);
    try {
      const response = await deleteUser(id);
      const successMessage = response?.data?.deleteUser?.name
        ? `${response.data.deleteUser.name} deleted successfully!`
        : "User deleted successfully!";
      toast.success(successMessage, {
        position: "top-right",
        duration: 2000,
      });
      setIsDeletingUser(null);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete user";
      toast.error(errorMessage);
    } finally {
      fetchUserData(setLoading, setUsers, toast);
      setDeleteId(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editUser.phoneNumber && !/^\d{10}$/.test(editUser.phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (editUser.age && (editUser.age < 16 || editUser.age > 100)) {
      toast.error("Age must be between 16 and 100");
      return;
    }

    try {
      const response = await updateUser(editUser._id, editUser, 'updateDetails');
      toast.success(`${editUser.name} updated successfully!`, {
        position: "top-right",
        duration: 2000,
      });
      setEditUser(null);
      fetchUserData(setLoading, setUsers, toast);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update employee";
      toast.error(errorMessage);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Dynamic filter logic
  const filteredUsers = users.filter((user) => {
    const matchesDept =
      selectedDepartment === "All" ||
      user.department?.toLowerCase() === selectedDepartment.toLowerCase();

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower) ||
      user.jobRole?.toLowerCase().includes(searchLower) ||
      user.phoneNumber?.includes(searchQuery) ||
      user.address?.toLowerCase().includes(searchLower);

    return matchesDept && matchesSearch;
  });

  // Dynamic sorting logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let valA = a[sortField] || "";
    let valB = b[sortField] || "";

    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Adjust page index if search filter reduces count
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [sortedUsers.length, totalPages, currentPage]);

  const currentItems = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Department tabs list with dynamic counters
  const departments = ["All", "Admin", "Sales", "Factory"];
  const getDeptCount = (dept) => {
    if (dept === "All") return users.length;
    return users.filter(u => u.department?.toLowerCase() === dept.toLowerCase()).length;
  };

  const DEPT_COLORS = {
    IT: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    Engineering: "bg-blue-50 text-blue-700 border border-blue-100",
    Finance: "bg-amber-50 text-amber-700 border border-amber-100",
    Sales: "bg-rose-50 text-rose-700 border border-rose-100",
    Admin: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Factory: "bg-cyan-50 text-cyan-700 border border-cyan-100",
  };

  const ROLE_COLORS = {
    Developer: "bg-sky-50 text-sky-700 border border-sky-100",
    Manager: "bg-purple-50 text-purple-700 border border-purple-100",
    Supervisor: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    Executive: "bg-red-50 text-red-700 border border-red-100",
    Admin: "bg-green-50 text-green-700 border border-green-100",
  };

  const getDeptBadge = (dept) => {
    return DEPT_COLORS[dept] || "bg-slate-50 text-slate-600 border border-slate-100";
  };
  const getRoleBadge = (role) => {
    return ROLE_COLORS[role] || "bg-slate-50 text-slate-600 border border-slate-100";
  };
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <>
      <Toaster />
      <div
        className="w-full max-w-full mx-auto animate-slideUp"
      >
        {/* Glassmorphic main container */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-100 overflow-hidden">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                    Employee Directory
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Manage and monitor team structure and credentials
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input with focus glowing */}
              <div className="relative flex-1 sm:flex-initial min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, role..."
                  className="w-full bg-slate-100/80 hover:bg-slate-150 focus:bg-white text-sm pl-10 pr-9 py-2 rounded-xl outline-none text-slate-700 placeholder:text-slate-400 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Add button with modern animation */}
              <button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
          </div>

          {/* Quick Filters - Horizontal tabs */}
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {departments.map((dept) => {
                const isActive = selectedDepartment === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-250 flex items-center gap-1.5 shrink-0 ${isActive
                        ? "bg-[#0d2145] text-white shadow-md shadow-[#0d2145]/15"
                        : "bg-white text-slate-500 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                  >
                    {dept}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                      {getDeptCount(dept)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] font-medium text-slate-400">
              Showing {sortedUsers.length} of {users.length} total employees
            </div>
          </div>

          {/* Table - Desktop View */}
          <div className="hidden md:block">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <LoaderCircleIcon className="animate-spin text-blue-600" size={40} />
                <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading employee data...</span>
              </div>
            )}

            {!loading && sortedUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No employees found</h3>
                <p className="text-xs text-slate-400 max-w-[280px] mt-1 leading-relaxed">
                  We couldn't find any results matching "{searchQuery}" in department "{selectedDepartment}".
                </p>
                {(searchQuery || selectedDepartment !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDepartment("All");
                    }}
                    className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}

            {!loading && sortedUsers.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3.5 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors"
                      >
                        Employee
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="px-6 py-3.5 text-left">
                      <button
                        onClick={() => handleSort("department")}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors"
                      >
                        Department
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="px-6 py-3.5 text-left">
                      <button
                        onClick={() => handleSort("jobRole")}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors"
                      >
                        Job Role
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150/40">
                  {currentItems.map((user, i) => (
                    <tr
                      key={user._id || i}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name Card */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2145] to-[#254275] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md shadow-[#0d2145]/5 hover:rotate-6 transition-all duration-300">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-400">@{user.username || "username"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDeptBadge(user.department)}`}>
                          {user.department}
                        </span>
                      </td>

                      {/* Job Role */}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getRoleBadge(user.jobRole)}`}>
                          {user.jobRole}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {user.phoneNumber}
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium max-w-[180px] truncate">
                        {user.address || "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => setEditUser(user)}
                            className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                            title="Edit employee details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setIsDeletingUser(user)}
                            className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                            title="Delete employee permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Cards - Mobile View */}
          <div className="md:hidden divide-y divide-slate-100">
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <LoaderCircleIcon className="animate-spin text-blue-600" size={36} />
                <span className="text-xs text-slate-500">Loading data...</span>
              </div>
            )}

            {!loading && sortedUsers.length === 0 && (
              <div className="text-center py-16 px-4">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No employees found</h3>
              </div>
            )}

            {!loading &&
              currentItems.map((user, i) => (
                <div key={user._id || i} className="px-5 py-4 hover:bg-slate-50/40 transition-colors">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d2145] to-[#254275] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{user.name}</div>
                        <div className="text-xs text-slate-400">@{user.username || "username"}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-slate-600 hover:text-blue-600 bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsDeletingUser(user)}
                        className="text-slate-600 hover:text-red-600 bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getDeptBadge(user.department)}`}>
                      {user.department}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getRoleBadge(user.jobRole)}`}>
                      {user.jobRole}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-[11px] text-slate-400 mt-2 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{user.phoneNumber}</span>
                    </div>
                    {user.address && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[260px]">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Footer - Pagination and Status */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400">
              Showing {sortedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length}{" "}
              employees
            </span>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all ${currentPage === page
                        ? "bg-[#0d2145] text-white shadow-md shadow-[#0d2145]/10"
                        : "bg-white border border-slate-200 text-[#0d2145] hover:bg-slate-50"
                      }`}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Register/Add Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg animate-scaleIn"
          >
            <RegisterPage setShowForm={setShowForm} setUsers={setUsers} setLoading={setLoading} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setEditUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-md w-full overflow-hidden animate-scaleIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Edit Employee</h3>
                  <p className="text-[10px] text-slate-400">Modify employee profile details</p>
                </div>
              </div>
              <button
                onClick={() => setEditUser(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={editUser.name || ""}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-9 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              {/* Username & Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                    <input
                      type="text"
                      value={editUser.username || ""}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300"
                      placeholder="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Age
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="number"
                      value={editUser.age || ""}
                      onChange={(e) => setEditUser({ ...editUser, age: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-9 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300"
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
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={editUser.phoneNumber || ""}
                      onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-9 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Department *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <select
                      value={editUser.department || ""}
                      onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Department</option>
                      {["Admin", "Sales", "Factory", "IT", "Engineering", "Finance"].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Job role */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Job Role *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <select
                    value={editUser.jobRole || ""}
                    onChange={(e) => setEditUser({ ...editUser, jobRole: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all appearance-none cursor-pointer"
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
                      "Sales man",
                      "Developer",
                      "Executive",
                      "Manager",
                      "Admin"
                    ].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                  <textarea
                    value={editUser.address || ""}
                    onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300 resize-none min-h-[60px]"
                    placeholder="Enter employee address"
                    rows={2}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0d2145] text-white hover:opacity-90 text-xs font-bold shadow-md shadow-[#0d2145]/15 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingUser && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsDeletingUser(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full text-center overflow-hidden animate-scaleIn"
          >
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="font-bold text-slate-800 text-base mb-1">{TRANSLATIONS.deleteEmployee}</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-2 mb-6">
              {TRANSLATIONS.deleteConfirmPrefix}<span className="font-semibold text-slate-700">{isDeletingUser.name}</span>{TRANSLATIONS.deleteConfirmSuffix}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeletingUser(null)}
                disabled={deleteId !== null}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {TRANSLATIONS.cancel}
              </button>
              <button
                onClick={() => confirmDelete(isDeletingUser._id)}
                disabled={deleteId !== null}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleteId === isDeletingUser._id ? (
                  <>
                    <LoaderCircleIcon className="w-3.5 h-3.5 animate-spin" />
                    {TRANSLATIONS.deleting}
                  </>
                ) : (
                  TRANSLATIONS.yesDelete
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}