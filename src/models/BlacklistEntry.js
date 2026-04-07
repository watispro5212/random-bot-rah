const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    targetId: { type: String, required: true, unique: true },
    reason: { type: String, default: 'No reason provided.' },
    adminId: { type: String, required: true },
    type: { type: String, enum: ['user', 'guild'], default: 'user' },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } });
module.exports = mongoose.model('BlacklistEntry', blacklistSchema);
