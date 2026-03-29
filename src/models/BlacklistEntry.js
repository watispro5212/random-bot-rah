const mongoose = require('mongoose');

/** Global user blacklist (owner-managed); synced to in-memory Set on boot and on changes. */
const blacklistSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    reason: { type: String, default: '' },
}, { timestamps: true });

blacklistSchema.index({ userId: 1 });

module.exports = mongoose.model('BlacklistEntry', blacklistSchema);
