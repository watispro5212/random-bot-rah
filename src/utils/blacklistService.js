const mongoose = require('mongoose');
const logger = require('./logger');
const BlacklistEntry = require('../models/BlacklistEntry');

function isDbReady() {
    return mongoose.connection.readyState === 1;
}

/**
 * Load all blacklisted user IDs from MongoDB into client.blacklist.
 */
async function hydrateClientBlacklist(client) {
    if (!isDbReady()) {
        logger.warn('[Blacklist] MongoDB not connected — blacklist stays in-memory only until DB is available.');
        return;
    }
    try {
        const docs = await BlacklistEntry.find().select('userId').lean();
        client.blacklist.clear();
        for (const d of docs) {
            client.blacklist.add(d.userId);
        }
        logger.info(`[Blacklist] Loaded ${docs.length} entr${docs.length === 1 ? 'y' : 'ies'} from database.`);
    } catch (err) {
        logger.error(`[Blacklist] Failed to load from database: ${err.message}`);
    }
}

/**
 * Persist add; updates memory Set on success (caller may already have updated memory).
 */
async function persistAdd(userId, reason) {
    if (!isDbReady()) return false;
    try {
        await BlacklistEntry.findOneAndUpdate(
            { userId },
            { userId, reason: reason || '' },
            { upsert: true, new: true },
        );
        return true;
    } catch (err) {
        logger.error(`[Blacklist] persistAdd failed: ${err.message}`);
        return false;
    }
}

/**
 * Persist remove.
 */
async function persistRemove(userId) {
    if (!isDbReady()) return false;
    try {
        await BlacklistEntry.deleteOne({ userId });
        return true;
    } catch (err) {
        logger.error(`[Blacklist] persistRemove failed: ${err.message}`);
        return false;
    }
}

module.exports = {
    hydrateClientBlacklist,
    persistAdd,
    persistRemove,
    isDbReady,
};
