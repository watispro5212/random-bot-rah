const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    targetId: { type: String, required: true, unique: true }, // User or Guild ID
    reason: { type: String, default: 'No reason provided.' },
    adminId: { type: String, required: true },
    type: { type: String, enum: ['user', 'guild'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlacklistEntry', blacklistSchema);
