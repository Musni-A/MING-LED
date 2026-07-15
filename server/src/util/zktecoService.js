import ZKLib from 'zkteco';

class ZKTecoService {
    constructor(ip, port = 4370, timeout = 5000) {
        this.ip = ip;
        this.port = port;
        this.timeout = timeout;
        this.device = null;
        this.connected = false;
    }

    async connect() {
        try {
            this.device = new ZKLib(this.ip, this.port, this.timeout, 4000);
            await this.device.createSocket();
            await this.device.connect();
            this.connected = true;
            console.log(`✅ Connected to ZKTeco device at ${this.ip}:${this.port}`);
            return true;
        } catch (error) {
            console.error('❌ ZKTeco connection failed:', error.message);
            throw new Error(`Device connection failed: ${error.message}`);
        }
    }

    async disconnect() {
        if (this.connected && this.device) {
            await this.device.disconnect();
            this.connected = false;
            console.log('🔌 Disconnected from ZKTeco device');
        }
    }

    async getAttendances() {
        try {
            if (!this.connected) await this.connect();
            const attendanceLogs = await this.device.getAttendances();
            console.log(`📊 Retrieved ${attendanceLogs.length} attendance records`);
            return attendanceLogs;
        } catch (error) {
            console.error('Error fetching attendances:', error);
            throw error;
        }
    }

    async getUsers() {
        try {
            if (!this.connected) await this.connect();
            const users = await this.device.getUsers();
            console.log(`👥 Retrieved ${users.length} users from device`);
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async setUser(userData) {
        try {
            if (!this.connected) await this.connect();
            const { uid, user_id, name, password = '', role = 0, cardno = 0 } = userData;
            await this.device.setUser(uid, user_id, name, password, role, cardno);
            console.log(`✅ User ${name} (ID: ${user_id}) added to device`);
            return true;
        } catch (error) {
            console.error('Error adding user to device:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            if (!this.connected) await this.connect();
            await this.device.deleteUser(userId);
            console.log(`🗑️ User ID ${userId} deleted from device`);
            return true;
        } catch (error) {
            console.error('Error deleting user from device:', error);
            throw error;
        }
    }

    async clearAttendanceLogs() {
        try {
            if (!this.connected) await this.connect();
            await this.device.clearAttendanceLog();
            console.log('🧹 All attendance logs cleared from device');
            return true;
        } catch (error) {
            console.error('Error clearing logs:', error);
            throw error;
        }
    }

    async getDeviceInfo() {
        try {
            if (!this.connected) await this.connect();
            const info = await this.device.getInfo();
            return {
                serialNumber: info.serialNumber,
                firmwareVersion: info.firmwareVersion,
                deviceName: info.deviceName,
                platform: info.platform,
                userCount: info.userCount,
                attendanceCount: info.attendanceCount
            };
        } catch (error) {
            console.error('Error getting device info:', error);
            throw error;
        }
    }

    async setDeviceTime() {
        try {
            if (!this.connected) await this.connect();
            await this.device.setTime(new Date());
            console.log('⏰ Device time synchronized with server');
            return true;
        } catch (error) {
            console.error('Error setting device time:', error);
            throw error;
        }
    }

    async rebootDevice() {
        try {
            if (!this.connected) await this.connect();
            await this.device.reboot();
            console.log('🔄 Device reboot command sent');
            return true;
        } catch (error) {
            console.error('Error rebooting device:', error);
            throw error;
        }
    }

    // Get real-time logs (for WebSocket)
    async getRealTimeLogs(callback) {
        try {
            if (!this.connected) await this.connect();
            // Some models support real-time push
            // This is a placeholder - implement based on your device model
            console.log('📡 Real-time monitoring started');
            // For actual real-time, you'd need to poll or use device's push feature
        } catch (error) {
            console.error('Error starting real-time monitoring:', error);
        }
    }
}

export default ZKTecoService;