// api/attendanceAPI.js
import axios from "axios";
import { baseURL } from "./userAPI";

export const API = axios.create({ baseURL: baseURL });

// ==================== ATTENDANCE APIs ====================

// Mark single attendance
export const markAttendance = (attendanceData) => API.post('/mark', attendanceData);

// Mark multiple attendance records
export const markMultipleAttendance = (records) => API.post('/mark-multiple', { records });

// Get attendance by date
export const getAttendanceByDate = (date) => API.get(`/date/${date}`);

// Get attendance by user
export const getUserAttendance = (userId, startDate, endDate) => {
    let url = `/attendance/user/${userId}`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return API.get(url);
};

// Get attendance by date range
export const getAttendanceByDateRange = (startDate, endDate) => 
    API.get(`/attendance/range/${startDate}/${endDate}`);

// Get monthly summary for a user
export const getMonthlySummary = (userId, year, month) => 
    API.get(`/attendance/summary/${userId}/${year}/${month}`);

// Get daily summary for a specific date
export const getDailySummary = (date) => API.get(`/date/${date}`);

// Update attendance record
export const updateAttendance = (id, attendanceData) => API.patch(`/attendance/${id}`, attendanceData);

// Delete attendance record
export const deleteAttendance = (id) => API.delete(`/attendance/${id}`);

// Get attendance statistics for dashboard
export const getAttendanceStats = (startDate, endDate) => 
    API.get(`/date/stats?startDate=${startDate}&endDate=${endDate}`);

// Get today's attendance summary
export const getTodaySummary = () => API.get('/today-summary');

// Get user's attendance history
export const getUserAttendanceHistory = (userId, page = 1, limit = 10) => 
    API.get(`/user/${userId}?page=${page}&limit=${limit}`);

// Bulk update attendance (for admin)
export const bulkUpdateAttendance = (updates) => API.patch('/attendance/bulk-update', { updates });

// Export attendance report
export const exportAttendanceReport = (startDate, endDate, format = 'csv') => 
    API.get(`/attendance/export?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
        responseType: 'blob'
    });