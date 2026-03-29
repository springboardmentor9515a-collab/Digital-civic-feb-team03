const fs = require('fs');
const path = require('path');
const AdminLog = require('../models/AdminLog');

/**
 * Immutable Audit Logger for Milestone 4.
 * Logs official actions to both MongoDB AdminLog collection and local file fallback.
 */
const logAction = async (action, details = {}) => {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action,
            ...details
        };

        console.log(`[LOG] ${action}:`, details);

        // Optional log payload to MongoDB
        // details expected: { user: ObjectId, petition: ObjectId, ...other details }
        if (details.user || details.userId) {
            try {
                await AdminLog.create({
                    action,
                    user: details.user || details.userId,
                    petition: details.petition || details.petitionId || null,
                    details: details,
                });
            } catch (dbError) {
                console.error('Failed to log to AdminLog DB:', dbError);
            }
        }

        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logFilePath = path.join(logDir, 'actions.log');
        fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
    } catch (error) {
        console.error('Logging failed:', error);
    }
};

module.exports = { logAction };
