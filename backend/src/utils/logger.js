const fs = require('fs');
const path = require('path');

// Simple logger to file to prepare hooks for reporting (Milestone 4)
const logAction = (action, details = {}) => {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            action,
            ...details
        };

        console.log(`[LOG] ${action}:`, details);

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
