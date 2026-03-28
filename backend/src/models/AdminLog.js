const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Petition',
        required: false
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
