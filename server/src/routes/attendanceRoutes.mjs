// routes/attendanceRoutes.js
import express from 'express';
import {Attendance} from '../mongoose/schema/attendence.mjs';

const router = express.Router();

// ================ MARK ATTENDANCE ==================

// Mark single attendance (NO AUTH)
router.post('/mark', async (req, res) => {
    try {
        const { userId, date, originalStatus, time, status, markedBy } = req.body;
        
        const statusMap = {
            'present': 'In Work',
            'absent': 'On Leave',
            'half-day': 'Half Day'
        };
        
        const attendance = await Attendance.findOneAndUpdate(
            { userId, date },
            {
                userId,
                date,
                status: status || statusMap[originalStatus],
                originalStatus,
                time: time || new Date().toLocaleTimeString(),
                markedBy: markedBy || 'system'
            },
            { upsert: true, new: true }
        );
        
        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data: attendance
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Mark multiple attendance records (NO AUTH)
router.post('/mark-multiple', async (req, res) => {
    try {
        const { records } = req.body;
        
        if (!records || records.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No records to save' 
            });
        }
        
        const operations = records.map(record => ({
            updateOne: {
                filter: { userId: record.userId, date: record.date },
                update: {
                    $set: {
                        userId: record.userId,
                        date: record.date,
                        status: record.status,
                        originalStatus: record.originalStatus,
                        time: record.time || new Date().toLocaleTimeString(),
                        markedBy: record.markedBy || 'system'
                    }
                },
                upsert: true
            }
        }));
        
        const result = await Attendance.bulkWrite(operations);
        
        res.json({
            success: true,
            message: `${result.modifiedCount + result.upsertedCount} attendance records saved`,
            data: {
                modified: result.modifiedCount,
                upserted: result.upsertedCount
            }
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get attendance by date (NO AUTH)
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const attendance = await Attendance.find({ date })
            .populate('userId', 'name email department jobRole')
            .populate('markedBy', 'name email');
        
        res.json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get attendance by user (NO AUTH)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;
        
        const query = { userId };
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }
        
        const attendance = await Attendance.find(query)
            .sort({ date: -1 })
            .populate('markedBy', 'name');
        
        res.json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get today's summary (NO AUTH)
router.get('/today-summary', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const records = await Attendance.find({ date: today })
            .populate('userId', 'name email department');
        
        const summary = {
            date: today,
            total: records.length,
            present: records.filter(r => r.originalStatus === 'present').length,
            absent: records.filter(r => r.originalStatus === 'absent').length,
            halfDay: records.filter(r => r.originalStatus === 'half-day').length,
            records: records
        };
        
        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Delete attendance record (NO AUTH)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findByIdAndDelete(id);
        
        if (!attendance) {
            return res.status(404).json({ 
                success: false, 
                message: 'Attendance record not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Attendance record deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

export default router;