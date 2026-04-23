// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    
    date: {
        type: String,
        required: [true, 'Date is required'],
        default: () => new Date().toISOString().split('T')[0],
        index: true
    },
    
    status: {
        type: String,
        enum: ['In Work', 'On Leave', 'Half Day'],
        default: 'Not marked'
    },
    
    originalStatus: {
        type: String,
        enum: ['present', 'absent', 'half-day'],
        required: true
    },
    
    time: {
        type: String,
        default: () => new Date().toLocaleTimeString()
    },
    
    checkInTime: {
        type: Date
    },
    
    checkOutTime: {
        type: Date
    },
    
    workingHours: {
        type: Number,
        default: 0,
        min: 0,
        max: 24
    },
    
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    
    remarks: {
        type: String,
        trim: true,
        maxlength: 500
    },
    
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Compound index to ensure one attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Pre-save middleware to set status based on originalStatus
attendanceSchema.pre('save', function(next) {
    const statusMap = {
        'present': 'In Work',
        'absent': 'On Leave',
        'half-day': 'Half Day'
    };
    
    if (this.originalStatus && statusMap[this.originalStatus]) {
        this.status = statusMap[this.originalStatus];
    }
    
    next();
});

// Virtual for formatted date
attendanceSchema.virtual('formattedDate').get(function() {
    return new Date(this.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Static method to get attendance by date
attendanceSchema.statics.getByDate = async function(date) {
    return await this.find({ date })
        .populate('userId', 'name email department jobRole')
        .sort({ createdAt: -1 });
};

// Static method to get attendance by user
attendanceSchema.statics.getByUser = async function(userId, startDate, endDate) {
    const query = { userId };
    if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
    }
    return await this.find(query).sort({ date: -1 });
};

// Static method to get monthly summary
attendanceSchema.statics.getMonthlySummary = async function(userId, year, month) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    const records = await this.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
    });
    
    return {
        present: records.filter(r => r.originalStatus === 'present').length,
        absent: records.filter(r => r.originalStatus === 'absent').length,
        halfDay: records.filter(r => r.originalStatus === 'half-day').length,
        total: records.length
    };
};

// Transform function for JSON response
attendanceSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        return ret;
    }
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);