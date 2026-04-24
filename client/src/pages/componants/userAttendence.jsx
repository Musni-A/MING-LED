// components/Attendance/AdminAttendanceDashboard.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllUsers } from "../../api/userAPI";
import { getAttendanceByDate, markMultipleAttendance } from "../../api/attendanceAPI";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Search, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid,
  Edit2,
  Trash2,
  X,
  Save,
  List,
  Menu
} from 'lucide-react';

export default function AdminAttendanceDashboard() {
  // State Management
  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [markedListSearchTerm, setMarkedListSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [markedListCurrentPage, setMarkedListCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [showMarkedList, setShowMarkedList] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [tabletView, setTableView] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [timeSelection, setTimeSelection] = useState({
    userId: null,
    userName: '',
    status: '',
    customTime: '',
    useCustomTime: false
  });

  // Responsive breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setMobileView(width < 640);
      setTableView(width >= 640 && width < 1024);
      if (width < 640) {
        setItemsPerPage(5);
        setViewMode("grid");
      } else if (width < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(10);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get unique departments
  const departments = useMemo(() => 
    ["all", ...new Set(users.map(user => user.department).filter(Boolean))], 
    [users]
  );

  // Filter users based on search and department
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === "" || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [users, searchTerm, filterDepartment]);

  const getEffectiveRecord = useCallback((userId) => {
    const unsaved = unsavedChanges.find(u => u.userId === userId);
    if (unsaved) return unsaved;
    return attendanceRecords.find(r => r.userId === userId);
  }, [unsavedChanges, attendanceRecords]);

  // Marked list
  const markedList = useMemo(() => {
    const savedRecords = attendanceRecords
      .filter(record => {
        const user = users.find(u => u._id === record.userId);
        if (!user) return false;
        
        const matchesSearch = markedListSearchTerm === "" || 
          user.name?.toLowerCase().includes(markedListSearchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(markedListSearchTerm.toLowerCase()) ||
          user.jobRole?.toLowerCase().includes(markedListSearchTerm.toLowerCase());
        
        const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
        const matchesStatus = filterStatus === "all" || record.originalStatus === filterStatus;
        
        return matchesSearch && matchesDepartment && matchesStatus;
      })
      .map(record => {
        const user = users.find(u => u._id === record.userId);
        return {
          ...record,
          userName: user?.name || 'Unknown',
          department: user?.department || 'N/A',
          jobRole: user?.jobRole || 'N/A',
          email: user?.email || 'N/A'
        };
      })
      .sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));
    
    return savedRecords;
  }, [attendanceRecords, users, markedListSearchTerm, filterDepartment, filterStatus]);

  // Pagination
  const markedListTotalPages = Math.ceil(markedList.length / itemsPerPage);
  const paginatedMarkedList = markedList.slice(
    (markedListCurrentPage - 1) * itemsPerPage,
    markedListCurrentPage * itemsPerPage
  );

  // Statistics
  const statistics = useMemo(() => {
    const savedRecords = attendanceRecords.filter(r => filteredUsers.some(u => u._id === r.userId));
    return {
      total: filteredUsers.length,
      present: savedRecords.filter(r => r.originalStatus === 'present').length,
      absent: savedRecords.filter(r => r.originalStatus === 'absent').length,
      halfDay: savedRecords.filter(r => r.originalStatus === 'half-day').length,
      saved: savedRecords.length,
      notSaved: filteredUsers.length - savedRecords.length,
      completionRate: filteredUsers.length > 0 
        ? ((savedRecords.length / filteredUsers.length) * 100).toFixed(1) 
        : 0,
      attendanceRate: filteredUsers.length > 0 
        ? ((savedRecords.filter(r => r.originalStatus === 'present').length / filteredUsers.length) * 100).toFixed(1)
        : 0,
      unsavedChanges: unsavedChanges.length
    };
  }, [filteredUsers, attendanceRecords, unsavedChanges]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      localStorage.setItem('users', JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  }, []);

  // Fetch saved attendance from database
  const fetchAttendance = useCallback(async (date) => {
    try {
      const response = await getAttendanceByDate(date);
      if (response.data?.data) {
        setAttendanceRecords(response.data.data);
      } else {
        setAttendanceRecords([]);
      }
      setUnsavedChanges([]);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setAttendanceRecords([]);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      await fetchAttendance(selectedDate);
      setLoading(false);
    };
    loadData();
  }, [fetchUsers, fetchAttendance]);

  // Fetch attendance when date changes
  useEffect(() => {
    if (!loading) {
      fetchAttendance(selectedDate);
      setMarkedListCurrentPage(1);
      setMarkedListSearchTerm("");
    }
  }, [selectedDate, fetchAttendance, loading]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment]);

  useEffect(() => {
    setMarkedListCurrentPage(1);
  }, [markedListSearchTerm, filterDepartment, filterStatus]);

  const openTimeModal = (userId, userName, status) => {
    const effective = getEffectiveRecord(userId);
    setTimeSelection({
      userId,
      userName,
      status,
      customTime: effective?.time || new Date().toLocaleTimeString(),
      useCustomTime: false
    });
    setShowTimeModal(true);
  };

  const markAttendanceLocal = (userId, userName, status, customTime = null) => {
    const finalTime = customTime || new Date().toLocaleTimeString();
    
    const statusMap = {
      'present': { display: 'Present', icon: '✅' },
      'absent': { display: 'Absent', icon: '❌' },
      'half-day': { display: 'Half Day', icon: '🌙' }
    };
    
    const existingUnsavedIndex = unsavedChanges.findIndex(u => u.userId === userId);
    
    const newRecord = {
      userId,
      date: selectedDate,
      originalStatus: status,
      time: finalTime,
      status: statusMap[status].display,
      isUnsaved: true
    };
    
    if (existingUnsavedIndex !== -1) {
      const updatedUnsaved = [...unsavedChanges];
      updatedUnsaved[existingUnsavedIndex] = { ...updatedUnsaved[existingUnsavedIndex], ...newRecord };
      setUnsavedChanges(updatedUnsaved);
      toast.success(`${userName} updated to ${statusMap[status].display} at ${finalTime}`);
    } else {
      setUnsavedChanges([...unsavedChanges, newRecord]);
      toast.success(`${userName} marked as ${statusMap[status].display} at ${finalTime}`);
    }
  };

  const quickMarkAttendance = (userId, userName, status) => {
    const effective = getEffectiveRecord(userId);
    
    if (effective && effective.originalStatus === status && !effective.isUnsaved) {
      toast(`${userName} is already saved as ${getStatusText(effective)}`, {
        icon: '⚠️',
        duration: 2000
      });
      return;
    }
    
    markAttendanceLocal(userId, userName, status, null);
  };

  const markAttendanceWithTime = () => {
    const { userId, userName, status, customTime, useCustomTime } = timeSelection;
    const finalTime = useCustomTime ? customTime : new Date().toLocaleTimeString();
    markAttendanceLocal(userId, userName, status, finalTime);
    setShowTimeModal(false);
  };

  const deleteUnsavedChange = (userId, userName) => {
    setUnsavedChanges(unsavedChanges.filter(u => u.userId !== userId));
    toast.success(`Unsaved change removed for ${userName}`);
  };

  const deleteSavedRecord = async (userId, userName) => {
    if (window.confirm(`Delete saved attendance record for ${userName}?`)) {
      const newUnsaved = {
        userId,
        date: selectedDate,
        originalStatus: 'absent',
        time: new Date().toLocaleTimeString(),
        status: 'Absent',
        isUnsaved: true,
        isDelete: true
      };
      setUnsavedChanges([...unsavedChanges, newUnsaved]);
      toast.warning(`${userName} marked as absent. Click Save All to apply changes.`);
    }
  };

  const editAttendanceTime = (userId, userName, currentTime) => {
    const newTime = prompt("Enter new time (format: HH:MM:SS AM/PM)", currentTime);
    if (newTime && newTime.trim()) {
      const existingUnsaved = unsavedChanges.find(u => u.userId === userId);
      if (existingUnsaved) {
        setUnsavedChanges(unsavedChanges.map(u => 
          u.userId === userId ? { ...u, time: newTime } : u
        ));
      } else {
        const savedRecord = attendanceRecords.find(r => r.userId === userId);
        if (savedRecord) {
          setUnsavedChanges([...unsavedChanges, {
            ...savedRecord,
            time: newTime,
            isUnsaved: true
          }]);
        }
      }
      toast.success(`Time updated to ${newTime} for ${userName}`);
    }
  };

  const saveAllAttendance = useCallback(async () => {
    if (unsavedChanges.length === 0) {
      toast.error("No unsaved changes to save");
      return;
    }
    
    setSaving(true);
    try {
      const recordsToSave = unsavedChanges.map(record => ({
        userId: record.userId,
        date: record.date || selectedDate,
        originalStatus: record.originalStatus,
        status: record.status,
        time: record.time,
        markedBy: localStorage.getItem('userId')
      }));
      
      const response = await markMultipleAttendance(recordsToSave);
      toast.success(response.data.message || `Saved ${unsavedChanges.length} attendance records`);
      await fetchAttendance(selectedDate);
      setUnsavedChanges([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }, [unsavedChanges, selectedDate, fetchAttendance]);

  const exportReport = useCallback(() => {
    const reportData = filteredUsers.map(user => {
      const savedRecord = attendanceRecords.find(r => r.userId === user._id);
      const unsaved = unsavedChanges.find(u => u.userId === user._id);
      const effective = unsaved || savedRecord;
      
      return {
        'Employee Name': user.name,
        'Department': user.department,
        'Job Role': user.jobRole,
        'Email': user.email,
        'Status': effective?.status || 'Not Marked',
        'Time': effective?.time || '-',
        'Date': selectedDate
      };
    });
    
    const csv = convertToCSV(reportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  }, [filteredUsers, attendanceRecords, unsavedChanges, selectedDate]);

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const getStatusBadgeClass = (record) => {
    if (!record) return 'bg-gray-100 text-gray-600';
    if (record.isUnsaved) return 'bg-orange-100 text-orange-700';
    switch(record.originalStatus) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'half-day': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (record) => {
    if (!record) return 'Not Marked';
    if (record.isUnsaved) return `${record.status} (Unsaved)`;
    return record.status || (record.originalStatus === 'present' ? 'Present' : 
           record.originalStatus === 'absent' ? 'Absent' : 'Half Day');
  };

  const getEffectiveRecordForUser = (userId) => {
    const unsaved = unsavedChanges.find(u => u.userId === userId);
    if (unsaved) return unsaved;
    return attendanceRecords.find(r => r.userId === userId);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasUnsavedChanges = unsavedChanges.length > 0;

  // Responsive Stat Card Component
  const StatCard = ({ title, value, color, icon: Icon, subtext }) => (
    <div className={`bg-white rounded-xl shadow-sm p-3 sm:p-4 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{title}</p>
          <p className={`text-xl sm:text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${color}-500 opacity-50`} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Loading attendance dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  setShowMarkedList(!showMarkedList);
                  setMarkedListCurrentPage(1);
                  setMarkedListSearchTerm("");
                }}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm ${
                  showMarkedList ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">{showMarkedList ? 'Hide' : 'Saved'} ({attendanceRecords.length})</span>
              </button>
              <button
                onClick={saveAllAttendance}
                disabled={saving || unsavedChanges.length === 0}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm ${
                  unsavedChanges.length > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="hidden sm:inline">{saving ? 'Saving...' : `Save (${unsavedChanges.length})`}</span>
              </button>
              <button
                onClick={exportReport}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1 text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    You have {unsavedChanges.length} unsaved change(s)
                  </p>
                  <p className="text-xs text-orange-600 hidden sm:block">
                    Click "Save Changes" to save them to the database
                  </p>
                </div>
              </div>
              <button
                onClick={saveAllAttendance}
                disabled={saving}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
              >
                Save Now
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard title="Total Employees" value={statistics.total} color="blue" icon={Users} />
          <StatCard title="Present" value={statistics.present} color="green" icon={CheckCircle} subtext={`${statistics.attendanceRate}% rate`} />
          <StatCard title="Absent" value={statistics.absent} color="red" icon={XCircle} />
          <StatCard title="Half Day" value={statistics.halfDay} color="yellow" icon={Clock} />
          <StatCard title="Saved Records" value={statistics.saved} color="purple" icon={CheckCircle} />
          <StatCard title="Unsaved" value={statistics.unsavedChanges} color="orange" icon={AlertCircle} />
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Database Saved Progress</span>
            <span>{statistics.completionRate}% Complete</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${statistics.completionRate}%` }}
            />
          </div>
          <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 text-xs text-gray-400 mt-2">
            <span>Not Saved: {statistics.notSaved}</span>
            <span>Present: {statistics.present}</span>
            <span>Absent: {statistics.absent}</span>
            <span>Half Day: {statistics.halfDay}</span>
          </div>
        </div>

        {/* Marked List View */}
        {showMarkedList && (
          <div className="bg-white rounded-xl shadow-sm mb-6 sm:mb-8 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-50 to-white border-b">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Saved Records for {new Date(selectedDate).toLocaleDateString()}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Total saved: {attendanceRecords.length} employee(s)
                </p>
              </div>
            </div>

            {/* Marked List Search and Filters */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search in saved records..."
                      value={markedListSearchTerm}
                      onChange={(e) => setMarkedListSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
            </div>

            {/* Marked List - Mobile Cards */}
            {mobileView && (
              <div className="divide-y divide-gray-100">
                {paginatedMarkedList.map((record) => (
                  <div key={record.userId} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.userName}</h3>
                        <p className="text-xs text-gray-500">{record.department} • {record.jobRole}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(record)}`}>
                        {getStatusText(record)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <button
                        onClick={() => editAttendanceTime(record.userId, record.userName, record.time)}
                        className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        {record.time}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openTimeModal(record.userId, record.userName, record.originalStatus)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSavedRecord(record.userId, record.userName)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Marked List - Desktop Table */}
            {!mobileView && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Department</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Job Role</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mark by</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceRecords.map((record) => (
                      <tr key={record.userId} className="hover:bg-gray-50">
                        {console.log(record)}
                        <td className="px-4 sm:px-6 py-4">{record.userId.name}</td>
                        <td className="px-4 sm:px-6 py-4">{record.userId.department}</td>
                        <td className="px-4 sm:px-6 py-4">{record.userId.jobRole}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(record)}`}>
                            {getStatusText(record)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">{record.markedBy.name}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <button
                            onClick={() => editAttendanceTime(record.userId, record.userName, record.time)}
                            className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            {record.time}
                          </button>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openTimeModal(record.userId, record.userName, record.originalStatus)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Time"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSavedRecord(record.userId, record.userName)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Marked List Pagination */}
            {markedListTotalPages > 1 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-between items-center">
                <button
                  onClick={() => setMarkedListCurrentPage(p => Math.max(1, p - 1))}
                  disabled={markedListCurrentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {markedListCurrentPage} of {markedListTotalPages}
                </span>
                <button
                  onClick={() => setMarkedListCurrentPage(p => Math.min(markedListTotalPages, p + 1))}
                  disabled={markedListCurrentPage === markedListTotalPages}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {paginatedMarkedList.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No saved records found matching your criteria
              </div>
            )}
          </div>
        )}

        {/* Filters for main view */}
        {!showMarkedList && (
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, department, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              {!mobileView && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded ${viewMode === "table" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content - Desktop Table View */}
        {!showMarkedList && viewMode === "table" && !mobileView && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Job Role</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUsers.map((user) => {
                    const effectiveRecord = getEffectiveRecordForUser(user._id);
                    const isUnsaved = unsavedChanges.some(u => u.userId === user._id);
                    const isSaved = attendanceRecords.some(r => r.userId === user._id);
                    
                    return (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          <div className="flex gap-1 mt-1">
                            {isUnsaved && (
                              <span className="inline-block text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                Unsaved
                              </span>
                            )}
                            {isSaved && !isUnsaved && (
                              <span className="inline-block text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                Saved
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600">{user.department}</td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600 hidden md:table-cell">{user.jobRole}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(effectiveRecord)}`}>
                            {getStatusText(effectiveRecord)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          {effectiveRecord?.time ? (
                            <button
                              onClick={() => editAttendanceTime(user._id, user.name, effectiveRecord.time)}
                              className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              <span className="text-sm">{effectiveRecord.time}</span>
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => quickMarkAttendance(user._id, user.name, 'present')}
                              className="px-2 sm:px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => quickMarkAttendance(user._id, user.name, 'absent')}
                              className="px-2 sm:px-3 py-1 bg-red-600 text-white text-xs sm:text-sm rounded hover:bg-red-700"
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => quickMarkAttendance(user._id, user.name, 'half-day')}
                              className="px-2 sm:px-3 py-1 bg-yellow-600 text-white text-xs sm:text-sm rounded hover:bg-yellow-700"
                            >
                              Half
                            </button>
                            <button
                              onClick={() => openTimeModal(user._id, user.name, 'present')}
                              className="px-2 sm:px-3 py-1 bg-gray-600 text-white text-xs sm:text-sm rounded hover:bg-gray-700"
                              title="Custom time"
                            >
                              <Clock className="w-3 h-3" />
                            </button>
                            {isUnsaved && (
                              <button
                                onClick={() => deleteUnsavedChange(user._id, user.name)}
                                className="px-2 sm:px-3 py-1 bg-orange-600 text-white text-xs sm:text-sm rounded hover:bg-orange-700"
                              >
                                Discard
                              </button>
                            )}
                          </div>
                       </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Grid/Mobile View */}
        {!showMarkedList && (viewMode === "grid" || mobileView) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {paginatedUsers.map((user) => {
              const effectiveRecord = getEffectiveRecordForUser(user._id);
              const isUnsaved = unsavedChanges.some(u => u.userId === user._id);
              
              return (
                <div key={user._id} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.department}</p>
                      <p className="text-xs text-gray-400">{user.jobRole}</p>
                      {isUnsaved && (
                        <span className="inline-block mt-1 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                          Unsaved
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(effectiveRecord)}`}>
                      {getStatusText(effectiveRecord)}
                    </span>
                  </div>
                  {effectiveRecord?.time && (
                    <div className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {effectiveRecord.time}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2">
                    <button
                      onClick={() => quickMarkAttendance(user._id, user.name, 'present')}
                      className="px-1 sm:px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => quickMarkAttendance(user._id, user.name, 'absent')}
                      className="px-1 sm:px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => quickMarkAttendance(user._id, user.name, 'half-day')}
                      className="px-1 sm:px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                    >
                      Half
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination for mobile/grid view */}
        {!showMarkedList && (viewMode === "grid" || mobileView) && totalPages > 1 && (
          <div className="mt-4 sm:mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {!showMarkedList && filteredUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No employees found matching your criteria</p>
          </div>
        )}

        {/* Time Selection Modal */}
        {showTimeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Select Time for {timeSelection.userName}
                </h3>
                <button onClick={() => setShowTimeModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={timeSelection.useCustomTime}
                      onChange={(e) => setTimeSelection({ ...timeSelection, useCustomTime: e.target.checked })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Use custom time</span>
                  </label>
                  {timeSelection.useCustomTime && (
                    <input
                      type="time"
                      value={timeSelection.customTime}
                      onChange={(e) => setTimeSelection({ ...timeSelection, customTime: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  {!timeSelection.useCustomTime && (
                    <p className="text-sm text-gray-500">Current time: {new Date().toLocaleTimeString()}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={markAttendanceWithTime}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowTimeModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()} | Total: {users.length} | Filtered: {filteredUsers.length}
          {unsavedChanges.length > 0 && ` | Unsaved: ${unsavedChanges.length}`}
        </div>
      </div>
    </div>
  );
}